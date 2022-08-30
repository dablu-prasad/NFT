const User=require("../models/userModels.js");

//Register a NFT Details
exports.nftDetails=async(req,res,next)=>{
    res.send("Nft Details is feeds");
    const {name,desc,category}=req.body;
console.log(req.body)
    const user=await User.create({
        nftname:name,
        nftdescription:desc,
        categaries:category
    });
    await user.save();
};