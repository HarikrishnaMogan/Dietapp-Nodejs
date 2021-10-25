const {userInfoSchema,updateCalorieSchema,NameandMailSchema} = require("../Shared/Schema");
const db = require("../Shared/Mongo");
const {ObjectId} = require("mongodb");

const service={

    async getuserDetails(req,res)
    {
        try{
             const data = await db.userinfo.findOne({userId:req.user.userId});
             res.send(data);
        }
        catch(err)
        {
            res.status(500).send({error:"server error"});
        }
    },

    async createUserInfo(req,res)
    {
        try{
            
               //schema validation
                let {error,value} = await userInfoSchema.validate(req.body);
                if(error)
                {
                    return res.status(401).send({error:error.details[0].message});
                }
                //check info exists
                const user = await db.userinfo.findOne({userId:req.user.userId});
                if(user)
                {
                    return res.status(401).send({error:"userinfo exists try to update user"});
                }

                let date = new Date().toDateString();
                //inserting in database
                const data = await db.userinfo.insertOne({...value,date,calories:0,water:0,track:[],food:[],userId:req.user.userId,userName:req.user.userName,email:req.user.email});
                res.send({success:"userinfo created"})
        }
        catch(err)
        {
            res.status(500).send({error:"server error"});
        }
    },

    //if user wants to change the diet plan
    async changeUserInfo(req,res)
    {
        try{
            
                //schema validation
                let {error,value} = await userInfoSchema.validate(req.body);
                if(error)
                {
                    return res.status(401).send({error:error.details[0].message});
                }

                //user verify for authorisation
                const user = await db.userinfo.findOne({_id:ObjectId(req.params.id),userId:req.user.userId});
                if(!user)
                {
                    return res.status(401).send({error:"you don't have access"});
                }

                //update data
                let date = new Date().toDateString();
               const data= await db.userinfo.findOneAndUpdate({userId:req.user.userId,_id:ObjectId(req.params.id)},
                {$set:{ ...value,date }},{returnDocument:"after"});

                res.send(data.value);
        }
        catch(err)
        {
            res.status(500).send({error:"server error"});
        }
    },

    //daily calories update
    async updateUserInfo(req,res)
    {
        try{
            //schema validation
            let {error,value} = await updateCalorieSchema.validate(req.body);
            if(error)
            {
                return res.status(401).send({error:error.details[0].message});
            }

            //user verify for authorisation
            const user = await db.userinfo.findOne({_id:ObjectId(req.params.id),userId:req.user.userId});
            if(!user)
            {
                return res.status(401).send({error:"you don't have access"});
            }

            //update data
           const data= await db.userinfo.findOneAndUpdate({userId:req.user.userId,_id:ObjectId(req.params.id)},
            {$set:{ ...value }},{returnDocument:"after"});

            res.send(data.value); 
    }
    catch(err)
    {
        res.status(500).send({error:"server error"});
    }
    },
   
  //to get user name and email
  async getuser(req,res)
  {
      try{
            const data = await db.users.aggregate([
                {$match:{_id:ObjectId(req.user.userId)}},
                {$project:{email:1,name:1,_id:0}}
            ]).toArray();
          
            res.send(data);
      }
      catch(err)
      {
         
        res.status(500).send({error:"server error"});
        
      }
  },

  //to change username and email
  async EmailandName(req,res)
  {
      try{
            
      
            let {error,value} = await NameandMailSchema.validate(req.body);
            if(error)
            {
                return res.status(401).send({error:error.details[0].message});
            }


            await db.userinfo.updateOne({userId:req.user.userId},{$set:{...value}});
           const data = await db.users.findOneAndUpdate({_id:ObjectId(req.user.userId)},{$set:{...value}},{returnDocument:"after"});
           
            res.send(data.value);
      }
      catch(err)
      {
        res.status(500).send({error:"server error"});
      }
  }
}

module.exports = service;