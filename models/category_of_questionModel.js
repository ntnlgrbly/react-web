const mongoose = require("mongoose");
const Joi = require("joi");

let category_questionSchema = new mongoose.Schema({
    name: String,
    short_id: String,
    url_name: String,
    img_url: String
})

exports.Category_questionModel = mongoose.model("category_of_question", category_questionSchema);

exports.validateCategoryQ = (_bodyReq) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        url_name: Joi.string().min(3).max(100).required(),
        img_url: Joi.string().min(3).max(500).allow(null, "")
    })
    return joiSchema.validate(_bodyReq);
}