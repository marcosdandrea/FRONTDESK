const JoiBase = require('joi')
const JoiDate = require("@joi/date")
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const schemaPost = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
})

const schemaPatch = Joi.object({
  title: Joi.string().required().min(10).max(20),
  paragraph: Joi.string().required().min(15).max(100),
  show_new_badge_until: Joi.date().format("DD/MM/YYYY").required().greater("now"),
  id: Joi.string().required().guid()
})

const fileFieldExist = (req, res, next) => {
  if (!req.file) res.status(404).send("You must include a file field")
}

module.exports = { schemaPost, schemaPatch, fileFieldExist }