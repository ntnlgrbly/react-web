const mongoose = require("mongoose");
const Joi = require("joi");

let answerSchema = new mongoose.Schema({
    name: String,
    short_id: String,
    answer: String,
    cat_short_id: String,
    short_id: String,
    user_id: String,
    date_created: {
        type: Date, default: Date.now()
    },
})

exports.AnswerModel = mongoose.model("answers", answerSchema);

exports.validateAnswer = (_bodyReq) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        answer: Joi.string().min(3).max(1000).required(),
        cat_short_id: Joi.string().min(2).max(99).required(),
    })
    return joiSchema.validate(_bodyReq);
}