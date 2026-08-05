const prisma = require("../prisma/client");


// ========================================
// CREATE BOOKING
// ========================================

exports.createBooking = async (req, res) => {

    try {


        const {
            name,
            fullName,
            email,
            phone,
            travellers,
            ages,
            travelDate,
            budget,
            destination,
            citizenship,
            idNumber,
            passportNumber,
            notes

        } = req.body;



        // Convert frontend budget values to Prisma enum

        let bookingBudget;


        if (
            budget === "budget" ||
            budget === "BUDGET"
        ) {

            bookingBudget = "BUDGET";

        }

        else if (
            budget === "mid" ||
            budget === "MID" ||
            budget === "MID_RANGE" ||
            budget === "mid_range"
        ) {

            bookingBudget = "MID_RANGE";

        }

        else {

            bookingBudget = "LUXURY";

        }




        const booking = await prisma.booking.create({

            data: {


                fullName:
                    fullName || name,


                email,


                phone,


                travellers:
                    Number(travellers),



                ages:
                    ages || null,



                travelDate:
                    new Date(travelDate),



                budget:
                    bookingBudget,



                destination,



                citizenship,



                idNumber:
                    idNumber || null,



                passportNumber:
                    passportNumber || null,



                notes:
                    notes || null


            }


        });



        res.status(201).json({

            success:true,

            message:"Booking submitted successfully.",

            booking

        });



    }


    catch(error){


        console.error(
            "CREATE BOOKING ERROR:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Failed to submit booking.",

            error:error.message

        });


    }


};




// ========================================
// GET ALL BOOKINGS
// ========================================

exports.getBookings = async (req,res)=>{


    try{


        const bookings =
            await prisma.booking.findMany({

                orderBy:{

                    createdAt:"desc"

                }

            });



        res.json(bookings);



    }


    catch(error){


        console.error(
            "GET BOOKINGS ERROR:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Unable to fetch bookings."

        });


    }


};





// ========================================
// UPDATE BOOKING STATUS
// ========================================

exports.updateBookingStatus = async(req,res)=>{


    try{


        const id =
            Number(req.params.id);



        const {
            status
        } = req.body;



        const booking =
            await prisma.booking.update({


                where:{


                    id


                },


                data:{


                    status


                }


            });



        res.json({


            success:true,


            message:
            `Booking ${status.toLowerCase()} successfully.`,


            booking


        });



    }


    catch(error){


        console.error(
            "UPDATE BOOKING ERROR:",
            error
        );


        res.status(500).json({


            success:false,


            message:"Unable to update booking."


        });


    }


};





// ========================================
// DELETE BOOKING
// ========================================

exports.deleteBooking = async(req,res)=>{


    try{


        const id =
            Number(req.params.id);



        await prisma.booking.delete({


            where:{


                id


            }


        });



        res.json({


            success:true,


            message:"Booking deleted successfully."


        });



    }


    catch(error){


        console.error(
            "DELETE BOOKING ERROR:",
            error
        );


        res.status(500).json({


            success:false,


            message:"Unable to delete booking."


        });


    }


};