require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");

const mongo = require("./Shared/Mongo");
const userRoute = require("./Routes/UsersRoute");
const auth = require("./Routes/AuthRoute");
const userInfoRoute = require("./Routes/UserInfoRoute");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);




let startServer =async()=>{

    try{
        await mongo.connect();

    app.use(cors());
    app.use(express.json());

    app.use((req,res,next)=>{
        console.log("logging server");
        next();
    })

    app.use("/users",userRoute);

    app.use(auth.authtoken);
       
    app.use("/userInfo",userInfoRoute);

    server.listen(PORT,()=>{console.log(`server started at Port ${PORT}`);})
    }
    catch(err)
    {
        console.log(err);
    }
   
}
startServer();