const JoiBase = require('joi')
const JoiDate = require("@joi/date")
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const schemaPostMedia = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
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

const schemaPatch = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  id: Joi.string().required().guid()
})

const schemaConfig = Joi.object({
  title: Joi.string().required().min(10).max(20),
  footer: Joi.string().required(),
  comunication_duration: Joi.number().required().min(10).max(240),
  comunication_interval: Joi.number().required().min(10).max(240)
})

module.exports = { schemaPostMedia, schemaPostIcon, schemaPatch, schemaConfig }