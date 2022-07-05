const mongoose = require("mongoose");
const Joi = require("joi");

let questionSchema = new mongoose.Schema({
    name: String,
    email: String,
    questions: String,
    Therapist: String,
    cat_short_id: String,
    date_created: {
        type: Date, default: Date.now()
    },
    user_id: String,
    short_id: String
})

exports.QuestionModel = mongoose.model("questions", questionSchema);

exports.validateQuestion = (_bodyReq) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(3).max(100).required(),
        questions: Joi.string().min(3).max(1000).required(),
        Therapist: Joi.string().min(3).max(20).allow(null, ""),
        cat_short_id: Joi.string().min(2).max(99).required(),

    })
    return joiSchema.validate(_bodyReq);
}