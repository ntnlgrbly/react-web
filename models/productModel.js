const mongoose = require("mongoose");
const Joi = require("joi");

let productScheam = new mongoose.Schema({
    name: String,
    info: String,
    title: String,
    text: String,
    img_url: String,
    cat_short_id: String,
    date_created: {
        type: Date, default: Date.now()
    },
    condition: String,
    user_id: String,
    qty: {
        type: Number, default: 1
    },
    short_id: String
})
exports.ProductModel = mongoose.model("products", productScheam)

exports.validateProduct = (_bodyReq) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        title: Joi.string().min(2).max(250).required(),
        info: Joi.string().min(3).max(1000).required(),
        text: Joi.string().min(3).max(12000).required(),
        cat_short_id: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(3).max(1000).allow(null, ""),
        condition: Joi.string().min(3).max(100).allow(null, ""),
        qty: Joi.string().min(1).max(9999).allow(null, ""),

    })
    return joiSchema.validate(_bodyReq);
}