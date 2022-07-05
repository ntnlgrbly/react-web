const express = require("express");
const { random } = require("lodash")
const { authUser } = require("../middlewares/auth");
const { Category_questionModel, validateCategoryQ } = require("../models/category_of_questionModel");


const router = express.Router();

// router.get("/", (req, res) => {
//     res.json({ msg: "Work category question.js 3333" })
// })
router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 20;
    let page = req.query.page >= 1 ? req.query.page - 1 : 0;
    try {
        let data = await Category_questionModel.find({})
            .limit(perPage)
            .skip(page * perPage)
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})
router.get("/single/:url_name", async (req, res) => {

    try {
        let data = await Category_questionModel.findOne({ url_name: req.params.url_name })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
//add new category
router.post("/", authUser, async (req, res) => {
    let validBody = validateCategoryQ(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let category = new Category_questionModel(req.body);
        category.short_id = await genShortId(); // 0 -999999 that not in use in another category
        await category.save();

        res.status(201).json(category);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
router.put("/:idEdit", authUser, async (req, res) => {
    let validBody = validateCategoryQ(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit
        let data = await Category_questionModel.updateOne({ _id: idEdit }, req.body)
        res.json(data)

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
router.delete("/:idDelete", authUser, async (req, res) => {

    try {
        let idDelete = req.params.idDelete
        let data = await Category_questionModel.deleteOne({ _id: idDelete })
        res.json(data)

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
            let data = await Category_questionModel.findOne({ short_id: rnd })
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