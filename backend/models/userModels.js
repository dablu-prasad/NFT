const mongoose = require("mongoose");

const NFTDetailsSchema = new mongoose.Schema(
  {
    nftname: String,
    nftdescription: String,
    categaries: String,
  }
);

const User=mongoose.model("nftdetails", NFTDetailsSchema);
module.exports=User;