const route = require("express").Router();
const service= require("../Services/UsersService");

route.post("/register",service.registerUser);
route.put("/verifyUser/:id",service.verifyUser);
route.post("/loginUser",service.loginUser);
route.put("/forgotPassword",service.sendPasswordResetLink);
route.get("/forgotPassword/:userId/:token",service.VerifyResetLink);
route.put("/resetPassword/:userId/:token",service.resetPassword);


module.exports=route;