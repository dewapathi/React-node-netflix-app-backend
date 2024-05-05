const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const moviesRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

dotenv.config();

const connectMongoDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('MongoDB Connection Successfull!'))
        .catch(err => console.log(err));
}
connectMongoDB();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/lists", listRoute);

app.listen(8800, () => {
    console.log("Backend server is running!");
});