const users = require("../Models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const photographers = require("../Models/photographerModel");


exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            res.status(400).json("User already exists");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new users({
                username,
                email,
                password: hashedPassword // Corrected assignment
            });
            await newUser.save();
            res.status(200).json(newUser);
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET);
                res.status(200).json({ user: existingUser, token });
            } else {
                // Always respond with a generic message for failed login attempts
                res.status(401).json({ message: "Incorrect email or password." });
            }
        } else {
            // Always respond with a generic message for failed login attempts
            res.status(401).json({ message: "Incorrect email or password." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.userinfo = async (req, res) => {
    const userId = req.payload;
    try {
        if (!userId) {
            return res.status(400).send({ success: false, message: "User ID is missing in the request payload" });
        }
        const user = await users.findOne({ _id: userId });
        user.password = undefined
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        console.log("Hello", user);
        res.status(200).send({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error getting user info:", error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};

// exports.applyVendor = async (req, res) => {
//     console.log("Inside applyVendor");

//     try {
//         // const {  name, city, state, description, genres } = req.body;
//         const userId = req.payload
//         // const coverImage = req.files['coverImage'][0].filename;
//         // const photos = req.files['photos'].map(file => file.filename);

//         const { name, city, state, description, genres } = req.body;
//         const coverImage = req.file.filename;

//         const photos = [];
//         for (const key in req.files) {
//             if (req.files.hasOwnProperty(key)) {
//                 req.files[key].forEach(file => {
//                     photos.push({ category: key, filename: file.filename });
//                 });
//             }
//         }

//         // Create a new photographer instance
//         const newPhotographer = new photographers({
//             userId,
//             name,
//             city,
//             state,
//             description,
//             genres,
//             coverImage,
//             photos,
//             status: 'pending'
//         });
//         await newPhotographer.save();
//         const adminUser = await users.findOne({ isAdmin: true });

//         const unseenNotification = adminUser.unseenNotification
//         unseenNotification.push({
//             message: `${newPhotographer.name} has applied for Vendor 's account`,
//             type: "new-vendor-request",
//             data: {
//                 photographerId: newPhotographer._id,
//                 name: newPhotographer.name
//             },
//             onClickPath: "/admin/photographers"
//         })
//         await users.findByIdAndUpdate(adminUser._id, { unseenNotification })
//     } catch (error) {
//         console.error("Error getting user info:", error);
//         res.status(500).send({ success: false, message: "Internal server error" });
//     }
// }

// const { validationResult } = require('express-validator');

exports.applyVendor = async (req, res) => {
    console.log("Inside applyVendor");

    try {
        const userId = req.payload;
        const { name, city, state, description, genres } = req.body;
        console.log("Hey vendor");
        console.log(genres);
        console.log(req.files);
        const {coverImage,photos}=req.files

        // Create a new photographer instance
        const newPhotographer = new photographers({
            userId,
            name,
            coverImage,
            city,
            state,
            genres,
            description,
            photos,
            status: 'pending'
        });
        await newPhotographer.save();

        // // Update admin user with notification
        const adminUser = await users.findOne({ isAdmin: true });
        adminUser.unseenNotification.push({
            message: `${newPhotographer.name} has applied for a vendor's account`,
            type: "new-vendor-request",
            data: {
                photographerId: newPhotographer._id,
                name: newPhotographer.name
            },
            onClickPath: "/admin/photographers"
        });
        await adminUser.save();

        res.status(201).json({ success: true, message: "Vendor application submitted successfully" });
    } catch (error) {
        console.error("Error applying as vendor:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
