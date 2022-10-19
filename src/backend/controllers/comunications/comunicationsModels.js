const JoiBase = require('joi')
const JoiDate = require("@joi/date")
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const schemaPost = Joi.object({
  title: Joi.string().required(),
  paragraph: Joi.string().required(),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  icon: Joi.string(),
  media: {
    filename: Joi.string().required(),
    originalName: Joi.string().required()
  } 
})
/*
const schemaPostMedia = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  media: Joi.string()
})

const schemaPostIcon = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  media: {
    filename: Joi.string().required(),
    originalName: Joi.string().required()
  }
})
*/

const schemaPatch = Joi.object({
  title: Joi.string().required(),
  paragraph: Joi.string().required(),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  id: Joi.string().required().guid()
})

const schemaConfig = Joi.object({
  title: Joi.string().required(),
  footer: Joi.string().required(),
  comunication_duration: Joi.number().required(),
  comunication_interval: Joi.number().required()
})

module.exports = { schemaPost, schemaPatch, schemaConfig }