const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const router=require("./routes/routeUser.js")

const app=express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
const mongoUrl =
  "mongodb+srv://dablu:dablu123@cluster0.i6tby.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

  //describe NFT details

  app.use("/user",router);

  app.listen(5000, () => {
    console.log("Server Started");
  });


