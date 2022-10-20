const JoiBase = require('joi')
const JoiDate = require("@joi/date")
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const schemaPost = Joi.object({
  title: Joi.string().required(),
  paragraph: Joi.string().required(),
  showNewBadgeUntil: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  comunicationExpiration: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  media: {
    filename: Joi.string().required(),
    originalName: Joi.string().required()
  } 
})

const schemaPatch = Joi.object({
  title: Joi.string().required(),
  paragraph: Joi.string().required(),
  showNewBadgeUntil: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  comunicationExpiration: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  id: Joi.string().required().guid()
})

const schemaConfig = Joi.object({
  title: Joi.string().required(),
  footer: Joi.string().required(),
  comunication_duration: Joi.number().required(),
  comunication_interval: Joi.number().required()
})

module.exports = { schemaPost, schemaPatch, schemaConfig }