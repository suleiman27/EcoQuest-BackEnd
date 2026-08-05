const prisma = require("../prisma/client");

exports.getStats = async (req, res) => {

    try {

        const total = await prisma.booking.count();

        const pending = await prisma.booking.count({
            where:{
                status:"PENDING"
            }
        });

        const confirmed = await prisma.booking.count({
            where:{
                status:"CONFIRMED"
            }
        });

        const cancelled = await prisma.booking.count({
            where:{
                status:"CANCELLED"
            }
        });

        const recentBookings = await prisma.booking.findMany({

            orderBy:{
                createdAt:"desc"
            },

            take:5

        });

        res.json({

            total,
            pending,
            confirmed,
            cancelled,
            recentBookings

        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

}