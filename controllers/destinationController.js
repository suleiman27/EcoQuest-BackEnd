const prisma = require("../prisma/client");


// GET ALL DESTINATIONS
exports.getDestinations = async (req,res)=>{

    try{

        const destinations = await prisma.destination.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });


        res.json(destinations);


    }catch(error){

        res.status(500).json({
            error:"Failed to fetch destinations"
        });

    }

};




// CREATE DESTINATION

exports.createDestination = async(req,res)=>{


    try{


        const destination = await prisma.destination.create({

            data:req.body

        });


        res.json(destination);



    }catch(error){

        res.status(500).json({
            error:"Failed to create destination"
        });

    }


};




// UPDATE DESTINATION

exports.updateDestination = async(req,res)=>{


try{


const destination = await prisma.destination.update({

where:{
id:Number(req.params.id)
},

data:req.body


});


res.json(destination);



}catch(error){


res.status(500).json({
error:"Failed to update destination"
});


}


};





// DELETE DESTINATION

exports.deleteDestination = async(req,res)=>{


try{


await prisma.destination.delete({

where:{
id:Number(req.params.id)
}

});


res.json({
message:"Deleted"
});



}catch(error){

res.status(500).json({
error:"Delete failed"
});


}


};