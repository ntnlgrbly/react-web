const express = require("express");
const { authUser } = require("../middlewares/auth");
const { validateQuestion, QuestionModel } = require("../models/questionModel");
const { random } = require("lodash")

const router = express.Router();




router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 15;
    let page = req.query.page >= 1 ? req.query.page - 1 : 0;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    let cat = req.query.cat || null
    try {
        objFind = (cat) ? { cat_short_id: cat } : {}
        let data = await QuestionModel.find(objFind)
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})
router.get("/search", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page >= 1 ? req.query.page - 1 : 0;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    let serachQ = req.query.s;
    try {
        let searchReg = new RegExp(serachQ, "i")
        let data = await QuestionModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})
// give the total amount of products in the collectoin of the db
router.get("/amount", async (req, res) => {
    try {
        let cat = req.query.cat || null
        objFind = (cat) ? { cat_short_id: cat } : {}
        let data = await QuestionModel.countDocuments(objFind);
        res.json({ amount: data });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
router.get("/visited", async (req, res) => {
    let visited = req.query.visited;
    // convert string to array 
    let visited_ar = visited.split(",");
    try {
        // return product that there short_id in the array
        let data = await ProductModel.find({ short_id: { $in: visited_ar } })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.get("/single/:id", async (req, res) => {

    try {
        let id = req.params.id

        let data = await QuestionModel.findOne({ _id: id })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post("/", authUser, async (req, res) => {
    let validBody = validateQuestion(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let questions = new QuestionModel(req.body);
        questions.user_id = req.tokenData._id;
        questions.short_id = await genShortId();
        await questions.save()
        res.status(201).json(questions)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

router.put("/:idEdit", authUser, async (req, res) => {
    let validBody = validateQuestion(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit
        let data = await QuestionModel.updateOne({ _id: idEdit }, req.body);
        res.status(201).json(data)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
const genShortId = async () => {
    let flag = true; // will become false if not found short_id = rnd
    // check if there no category with rnd = short_id;
    let rnd;
    while (flag) {
        rnd = random(0, 999999)
        try {
            let data = await QuestionModel.findOne({ short_id: rnd })
            if (!data) {
                flag = false;
            }
        }
        catch (err) {
            console.log(err);
            flag = false;
            return res.status(500).json(err);
        }
    }
    return rnd;
}


module.exports = router;