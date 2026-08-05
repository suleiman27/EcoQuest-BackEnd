const prisma = require("../prisma/client");

// ========================================
// GET CUSTOMERS
// ========================================

exports.getCustomers = async (req, res) => {

    try {

        const bookings = await prisma.booking.findMany({

            orderBy: {

                createdAt: "desc"

            }

        });

        const customersMap = {};

        bookings.forEach(booking => {

            if (!customersMap[booking.email]) {

                customersMap[booking.email] = {

                    id: booking.id,

                    fullName: booking.fullName,

                    email: booking.email,

                    phone: booking.phone,

                    trips: 0,

                    amount: 0,

                    destination: booking.destination,

                    lastBooking: booking.travelDate,

                    createdAt: booking.createdAt

                };

            }

            customersMap[booking.email].trips++;

            if (
                new Date(booking.travelDate) >
                new Date(customersMap[booking.email].lastBooking)
            ) {

                customersMap[booking.email].lastBooking =
                    booking.travelDate;

                customersMap[booking.email].destination =
                    booking.destination;

            }

        });

        res.json(Object.values(customersMap));

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to load customers."

        });

    }

};

// ========================================
// DELETE CUSTOMER
// ========================================

exports.deleteCustomer = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const booking = await prisma.booking.findUnique({

            where: {

                id

            }

        });

        if (!booking) {

            return res.status(404).json({

                success: false,

                message: "Customer not found."

            });

        }

        await prisma.booking.deleteMany({

            where: {

                email: booking.email

            }

        });

        res.json({

            success: true,

            message: "Customer deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to delete customer."

        });

    }

};