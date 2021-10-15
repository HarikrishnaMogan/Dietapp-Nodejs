const route = require("express").Router();
const service = require("../Services/UserInfoService");

route.get("/",service.getuser);
route.post("/createInfo",service.createUserInfo);
route.put("/:id",service.changeUserInfo);
route.put("/calories/:id",service.updateUserInfo);

module.exports = route;