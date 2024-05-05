const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//Create list
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(201).json(savedList);
        } catch (err) {
            res.status(500).json({ message: "Internal server error!", err });
        }
    } else {
        res.status(403).json({ message: "You are not allowed!" });
    }
});

//Delete list
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "The list has been deleted...!" });
    } else {
        res.status(403).json({ message: "You are not allowed to delete a list!" });
    }
});

//Get list with query
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ]);
            } else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ]);
            }
        } else {
            list = await List.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" });
    }
});

//Get all list
// router.get("/", verify, async (req, res) => {
//     if (req.user.isAdmin) {
//         const lists = await List.find();
//         res.status(200).json(lists);
//     } else {
//         res.status(403).json({ message: "You are not allowed!" });
//     }
// });

module.exports = router;