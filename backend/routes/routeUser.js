const express=require("express");
const{nftDetails} =require("../controllers/userControllers.js");

const router=express.Router();
router.post("/",nftDetails);

module.exports=router;