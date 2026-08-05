const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");


// Get all contact messages
router.get("/", async (req, res) => {

    try {

        const messages = await prisma.contact.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to fetch messages"
        });

    }

});


module.exports = router;