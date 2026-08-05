const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// =====================================
// REGISTER ADMIN (RUN ONCE)
// =====================================

exports.register = async (req, res) => {

    try {

        const { username, email, password } = req.body;


        const exists = await prisma.admin.findFirst({

            where: {

                OR: [
                    { username },
                    { email }
                ]

            }

        });



        if (exists) {

            return res.status(400).json({

                success:false,
                message:"Admin already exists."

            });

        }



        const hashedPassword =
        await bcrypt.hash(password,10);



        const admin =
        await prisma.admin.create({

            data:{

                username,
                email,
                password:hashedPassword

            }

        });



        res.status(201).json({

            success:true,
            message:"Admin created successfully.",

            admin:{
                id:admin.id,
                username:admin.username,
                email:admin.email
            }

        });



    }

    catch(error){

        console.error(error);


        res.status(500).json({

            success:false,
            message:"Registration failed."

        });


    }

};







// =====================================
// LOGIN ADMIN
// =====================================

exports.login = async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;




        const admin =
        await prisma.admin.findUnique({

            where:{
                email
            }

        });





        if(!admin){


            return res.status(401).json({

                success:false,
                message:"Invalid credentials."

            });


        }





        const validPassword =
        await bcrypt.compare(

            password,
            admin.password

        );





        if(!validPassword){


            return res.status(401).json({

                success:false,
                message:"Invalid credentials."

            });


        }





        const token =
        jwt.sign(

            {
                id:admin.id,
                email:admin.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"1d"
            }

        );





        res.json({

            success:true,

            token,

            admin:{

                id:admin.id,
                username:admin.username,
                email:admin.email

            }

        });



    }

    catch(error){


        console.error(error);


        res.status(500).json({

            success:false,
            message:"Login failed."

        });


    }


};









// =====================================
// GET ADMIN PROFILE
// =====================================

exports.getProfile = async(req,res)=>{


    try{


        const admin =
        await prisma.admin.findUnique({

            where:{

                id:req.admin.id

            },


            select:{

                id:true,
                username:true,
                email:true

            }


        });





        if(!admin){


            return res.status(404).json({

                message:"Admin not found"

            });


        }





        res.json(admin);



    }

    catch(error){


        console.error(error);


        res.status(500).json({

            message:"Failed to load profile"

        });


    }


};









// =====================================
// UPDATE ADMIN PROFILE
// =====================================

exports.updateProfile = async(req,res)=>{


    try{


        const {

            username,
            email

        } = req.body;





        const updatedAdmin =
        await prisma.admin.update({


            where:{

                id:req.admin.id

            },


            data:{


                username,
                email


            },


            select:{


                id:true,
                username:true,
                email:true


            }


        });





        res.json({

            message:"Profile updated successfully",

            admin:updatedAdmin

        });



    }

    catch(error){


        console.error(error);


        res.status(500).json({

            message:"Profile update failed"

        });


    }


};









// =====================================
// CHANGE PASSWORD
// =====================================

exports.changePassword = async(req,res)=>{


    try{


        const {

            currentPassword,
            newPassword

        } = req.body;





        const admin =
        await prisma.admin.findUnique({

            where:{

                id:req.admin.id

            }

        });





        if(!admin){


            return res.status(404).json({

                message:"Admin not found"

            });


        }






        const validPassword =
        await bcrypt.compare(

            currentPassword,
            admin.password

        );





        if(!validPassword){


            return res.status(400).json({

                message:"Current password is incorrect"

            });


        }







        const hashedPassword =
        await bcrypt.hash(

            newPassword,
            10

        );






        await prisma.admin.update({


            where:{

                id:req.admin.id

            },


            data:{


                password:hashedPassword


            }


        });






        res.json({

            message:"Password changed successfully"

        });





    }

    catch(error){


        console.error(error);


        res.status(500).json({

            message:"Password change failed"

        });


    }


};