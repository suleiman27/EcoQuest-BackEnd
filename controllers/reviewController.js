const prisma = require("../prisma/client");


// ==========================================
// CREATE REVIEW (PUBLIC)
// ==========================================

exports.createReview = async (req, res) => {

    try {

        const {
            name,
            rating,
            comment
        } = req.body;


        if (!name || !rating || !comment) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }



        const review = await prisma.review.create({

            data: {

                name,

                rating: Number(rating),

                comment,

                approved: false

            }

        });



        res.status(201).json({

            message:
            "Review submitted successfully and awaiting approval",

            review

        });


    }

    catch(error){

        console.error(error);


        res.status(500).json({

            message:"Failed to submit review"

        });


    }

};







// ==========================================
// GET APPROVED REVIEWS (PUBLIC)
// ==========================================

exports.getReviews = async(req,res)=>{

    try{


        const reviews =
        await prisma.review.findMany({

            where:{

                approved:true

            },

            orderBy:{

                createdAt:"desc"

            }

        });


        res.json(reviews);


    }

    catch(error){


        console.error(error);


        res.status(500).json({

            message:"Failed to load reviews"

        });


    }

};








// ==========================================
// ADMIN GET ALL REVIEWS
// ==========================================

exports.getAllReviews = async(req,res)=>{


    try{


        const reviews =
        await prisma.review.findMany({

            orderBy:{

                createdAt:"desc"

            }

        });


        res.json(reviews);


    }

    catch(error){


        res.status(500).json({

            message:"Failed to fetch reviews"

        });


    }


};









// ==========================================
// APPROVE REVIEW
// ==========================================

exports.approveReview = async(req,res)=>{


    try{


        const {id}=req.params;



        const review =
        await prisma.review.update({

            where:{

                id:Number(id)

            },


            data:{

                approved:true

            }

        });



        res.json({

            message:"Review approved",

            review

        });


    }

    catch(error){


        res.status(500).json({

            message:"Failed to approve review"

        });


    }


};









// ==========================================
// DELETE REVIEW
// ==========================================

exports.deleteReview = async(req,res)=>{


    try{


        const {id}=req.params;



        await prisma.review.delete({

            where:{

                id:Number(id)

            }

        });



        res.json({

            message:"Review deleted"

        });


    }

    catch(error){


        res.status(500).json({

            message:"Failed to delete review"

        });


    }


};