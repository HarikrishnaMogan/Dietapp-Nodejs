const route = require("express").Router();
const service = require("../Services/UserInfoService");

route.get("/",service.getuserDetails);
route.post("/createInfo",service.createUserInfo);
route.put("/:id",service.changeUserInfo);
route.put("/calories/:id",service.updateUserInfo);
route.get("/user",service.getuser);
route.put("/user/change",service.EmailandName);


module.exports = route;