const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//Create movie
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        } catch (err) {
            res.status(500).json({ message: "Internal server error!" });
        }
    } else {
        res.status(403).json({ message: "You are not allowed!" });
    }
});

//Update movie
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedmovie = await Movie.findByIdAndUpdate(req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updatedmovie);
        } catch (err) {
            res.status(500).json({ message: "Internal server error!" });
        }
    } else {
        res.status(403).json({ message: "You can update only your account!" });
    }
});

//Delete movie
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Movie has been deleted...!" })
        } catch (err) {
            res.status(500).json({ message: "Internal server error!" });
        }
    } else {
        res.status(403).json({ message: "You are not allowed to delete movie!" });
    }
});

//Get movie
router.get("/find/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" });
    }
});

//Get random
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;

    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ]);
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" });
    }
});

//Get all movies
router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        } catch (err) {
            res.status(500).json({ message: "Internal server error!", err });
        }
    } else {
        res.status(403).json({ message: "You are not allowed!" });
    }
});

module.exports = router;