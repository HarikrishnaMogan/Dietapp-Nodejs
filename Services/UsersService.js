const {userSchema,loginSchema,passResetSchema,newPassSchema} = require("../Shared/Schema");
const db =  require("../Shared/Mongo");
const bcrypt = require("bcrypt");
const sendMail = require("./SendMail");
const {ObjectId} = require("mongodb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const service={
async registerUser(req,res)
{
    try{

        //schema validation
       const {error,value} = await userSchema.validate(req.body);
       if(error)
       {
          return res.status(401).send({error:error.details[0].message})
       }

       //check user alreay exists
       const user = await db.users.findOne({email:value.email});
       if(user)
       {
           return res.send({error:"user already exists"});
       }

       //creating salt and encrypt password
       const salt = await bcrypt.genSalt(10);
       value.password = await bcrypt.hash(value.password,salt);
       
       //insert user in database
       const{insertedId} = await db.users.insertOne({...value,isVerified:false,passReset:"0",resetlimit:0});

       //sending verification mail
       const link = `<p>Hi user, welcome to Dietify</p>
        <p>Kindly click the link below to verify</p><br/>
      <a href="https://hari-dietify.netlify.app/verifyuser/${insertedId}">Click here</a>`;

       await sendMail(value.email,"Verify User",link)

       res.status(200).send({success:"user registered success"});

    }
    catch(err)
    {
             res.status(500).send({error:"server error"});
    }
},

async verifyUser(req,res)
{
     try{

        //check user to verify
            const user = await db.users.findOne({_id:ObjectId(req.params.id)});
            if(!user)
            {
                return res.status(401).send({error:"you are not authorised"});
            }

            //verified in database
            await db.users.updateOne({_id:ObjectId(req.params.id)},{$set:{isVerified:true}});
            res.send({success:"user verify sucess"})

     }
     catch(err)
     {
        res.status(500).send({error:"server error"});
     }
},


async loginUser(req,res)
{
     try{
            //schema validation
       const {error,value} = await loginSchema.validate(req.body);
       if(error)
       {
          return res.status(401).send({error:error.details[0].message})
       }
        //user verification check
        const user = await db.users.findOne({email:value.email});
        if(!user)
        {
            return res.send({error:"user doesn't exists"});
        }
        
        //verify password
        const isValid = await bcrypt.compare(value.password,user.password);
        if(!isValid)
        {   
          
            return res.send({error:"password is wrong"});
        }
          
         //check user is verified or not
         if(!user.isVerified)
         {
            const link = `<p>Hi user, welcome to Dietify</p>
            <p>Kindly click the link below to verify</p><br/>
          <a href="https://hari-dietify.netlify.app/verifyuser/${user._id}">Click here</a>`;
            await sendMail(value.email,"Verify User",link)
             return res.send({error:"User is not Verified,Link sent to email"});
         }

        //creating jwt
        const authtoken = jwt.sign(
            {userId:user._id,email:user.email,userName:user.name},
            process.env.JWTSECRET,
            {expiresIn:"8h"}
        );

        res.send({authtoken});

     }
     catch(err)
     {
        res.status(500).send({error:"server error"});
     }
},

async sendPasswordResetLink(req,res)
{
    try{

        //schema validation
        let {error,value} = await passResetSchema.validate(req.body);
        if(error)
        {
            return res.status(401).send({error:error.details[0].message});
        }
          //check user exists
          const user = await db.users.findOne({email:value.email});
          if(!user)
          {
            return res.send({error:"user doesn't exists"});
          }
          
          //creating random string and update in db
          const token = crypto.randomBytes(32).toString("hex");
          const salt = await bcrypt.genSalt(10);
          const hashtoken = await bcrypt.hash(token,salt);
          const expire = Date.now()+15*60*1000;

          await db.users.updateOne({email:user.email},{$set:{passReset:hashtoken,resetlimit:expire}});
          
          

          //send email
          const link = `<p>Hi user, password Reset verification from Dietify</p>
          <p>Kindly click the link below to Reset your password</p><br/>
        <a href="https://hari-dietify.netlify.app/passverifylink/${user._id}/${token}">Click here</a>`;

          await sendMail(user.email,"Forgot password Reset",link);

          res.send({success:"password reset link sent"});

    }
    catch(err)
    {
       res.status(500).send({error:"server error"});
      
    }
},

async VerifyResetLink(req,res)
{
   try{

    //get the particular user
        const user = await db.users.findOne({_id:ObjectId(req.params.userId)});
        if(!user)
        {
            return res.send({error:"link expired"});
        } 
     
    //validating user
    const isValid = await bcrypt.compare(req.params.token,user.passReset);
    const expire =  user.resetlimit > Date.now();
    console.log(user.resetlimit,Date.now());
    console.log(isValid);
    if(!isValid || !expire)
    {
       return res.send({error:"reset link expired"});
    }
    
    res.send({success:"reset link verified"});

   }
   catch(err)
    {
       res.status(500).send({error:"server error"});
      
    }
},

async resetPassword(req,res)
{
    try{

        //schema validate
          let {error,value} = await newPassSchema.validate(req.body);
          if(error)
          {
              return res.status(401).send({error:error.details[0].message});
          }
         
          //get the particular user
        const user = await db.users.findOne({_id:ObjectId(req.params.userId)});
        if(!user)
        {
            return res.send({error:"link expired"});
        } 
        //validating user
        const isValid = await bcrypt.compare(req.params.token,user.passReset);
        const expire =  user.resetlimit > Date.now();
        console.log(user.resetlimit,Date.now());
        console.log(isValid);
        if(!isValid || !expire)
       {
       return res.send({error:"reset link expired"});
       }
        //genereate salt and encrypt password
        const salt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(value.password,salt);

        //updating password 
       await db.users.updateOne({_id:ObjectId(req.params.userId)},{$set:{
          password:value.password,
          passReset:'0'
       }})
      
       res.send({success:"password updated"})
    }
    catch(err)
    {
       res.status(500).send({error:"server error"});
      
    }
}

}

module.exports = service;