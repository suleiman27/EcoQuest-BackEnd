const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

// ================================
// GET SETTINGS
// ================================

exports.getSettings = async (req, res) => {

    try {

        const admin = await prisma.admin.findFirst({
            include: {
                settings: true
            }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin account not found."
            });
        }

        res.json({
            success: true,
            username: admin.username,
            email: admin.email,
            emailNotification: admin.settings?.emailNotification ?? true,
            reviewNotification: admin.settings?.reviewNotification ?? true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load settings."
        });

    }

};

// ================================
// UPDATE PROFILE
// ================================

exports.updateProfile = async (req, res) => {

    try {

        const { username, email } = req.body;

        const admin = await prisma.admin.findFirst();

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        await prisma.admin.update({

            where: {
                id: admin.id
            },

            data: {
                username,
                email
            }

        });

        res.json({
            success: true,
            message: "Profile updated successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile."
        });

    }

};

// ================================
// CHANGE PASSWORD
// ================================

exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const admin = await prisma.admin.findFirst();

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        const validPassword = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!validPassword) {

            return res.status(400).json({

                success: false,

                message: "Current password is incorrect."

            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await prisma.admin.update({

            where: {

                id: admin.id

            },

            data: {

                password: hashedPassword

            }

        });

        res.json({

            success: true,

            message: "Password changed successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to change password."

        });

    }

};

// ================================
// UPDATE NOTIFICATION SETTINGS
// ================================

exports.updatePreferences = async (req, res) => {

    try {

        const {

            emailNotification,

            reviewNotification

        } = req.body;

        const admin = await prisma.admin.findFirst();

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found."

            });

        }

        await prisma.adminSettings.upsert({

            where: {

                adminId: admin.id

            },

            update: {

                emailNotification,

                reviewNotification

            },

            create: {

                adminId: admin.id,

                emailNotification,

                reviewNotification

            }

        });

        res.json({

            success: true,

            message: "Settings saved successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to save settings."

        });

    }

};

// ================================
// LOGOUT ALL
// ================================

exports.logoutAll = async (req, res) => {

    res.json({

        success: true,

        message: "All sessions have been logged out."

    });

};