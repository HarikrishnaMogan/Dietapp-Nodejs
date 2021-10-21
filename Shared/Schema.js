const Joi = require("joi");

const schema = {
  userSchema:Joi.object({
      name:Joi.string().min(3).required(),
      email:Joi.string().email().pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).required(),
      password:Joi.string().min(6).max(12).required()
  }),

  loginSchema:Joi.object({
      email:Joi.string().email().required(),
      password:Joi.string().required()
  }),

  passResetSchema:Joi.object({
    email:Joi.string().email().required()
  }),
  newPassSchema:Joi.object({
    password:Joi.string().min(6).max(12).required()
  }),
 
   NameandMailSchema:Joi.object({
    name:Joi.string().min(3),
    email:Joi.string().email().pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
   }),

   

  //user info schemas
  userInfoSchema:Joi.object({
    height:Joi.number().required(),
    weight:Joi.number().required(),
    targetWeight:Joi.number().required(),
    age:Joi.number().required(),
    activityFactor:Joi.number().required(),
    totalDays:Joi.number().required(),
    gender:Joi.string().required()

  }),

  updateCalorieSchema:Joi.object({
    calories:Joi.number(),
    date:Joi.string(),
    track:Joi.array(),
    water:Joi.number(),
    food:Joi.array()
  })
}
module.exports = schema;