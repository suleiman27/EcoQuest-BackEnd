const prisma = require("../prisma/client");

// Create Contact
exports.createContact = async (req, res) => {

    try {

        const { name, email, subject, message } = req.body;

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            contact
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to send message."
        });

    }

};

// Get All Contacts
exports.getContacts = async (req, res) => {

    try {

        const contacts = await prisma.contact.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(contacts);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch contacts."
        });

    }

};