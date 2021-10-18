const nodemailer = require("nodemailer");


const sendMail= async(email,subject,link)=>{

    try{


 let transporter = await nodemailer.createTransport({
    service:"hotmail",
    auth:{
        user:"diettracker456@outlook.com",
        pass:process.env.PASS
    }
 })

 let mailOptions ={
     from:"diettracker456@outlook.com",
     to:email,
     subject:subject,
     text:link
 }

  transporter.sendMail(mailOptions,(err)=>{
     if(err)
     {
       
         console.log("eamil error"+err);
     }
 });
}
catch(err)
{
    console.log("email error"+err);
}

}

module.exports= sendMail;