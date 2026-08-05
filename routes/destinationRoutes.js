const express = require("express");

const router = express.Router();


const {

getDestinations,
createDestination,
updateDestination,
deleteDestination

}=require("../controllers/destinationController");





router.get("/",getDestinations);


router.post("/",createDestination);


router.put("/:id",updateDestination);


router.delete("/:id",deleteDestination);



module.exports=router;