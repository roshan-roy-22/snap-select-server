const users = require("../Models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const photographers = require("../Models/photographerModel");
const bookings = require("../Models/bookingModel");
// const bookings = require("../Models/bookingModel");


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

//get user info for all
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

;
//apply for vendor for user
exports.applyVendor = async (req, res) => {
    console.log("Inside applyVendor");

    try {
        const userId = req.payload;
        const { name, city, state, description, genres } = req.body;
        console.log("Hey vendor");
        console.log(genres);
        console.log(req.files);
        const { coverImage, photos } = req.files

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
            onClickPath: "/admin-photographerlist"
        });
        await adminUser.save();

        res.status(201).json({ success: true, message: "Vendor application submitted successfully" });
    } catch (error) {
        console.error("Error applying as vendor:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//for all
exports.notificationSeen = async (req, res) => {
    const userId = req.payload;
    try {
        const user = await users.findOne({ _id: userId })
        const unseenNotification = user.unseenNotification;
        const seenNotification = user.seenNotifation;
        seenNotification.push(...unseenNotification);
        user.unseenNotification = [];
        user.seenNotifation = seenNotification
        const updateUser = await user.save();
        updateUser.password = undefined
        res.status(200).send({
            success: true,
            message: "All notification are marked as seen",
            data: updateUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while marking"
            , success: false,
            error
        })
    }
}

//for all
exports.deleteNotifation = async (req, res) => {
    const userId = req.payload;
    try {
        const user = await users.findOne({ _id: userId })
        user.seenNotifation = []
        user.unseenNotification = []
        const updateUser = await user.save();
        res.status(200).send({
            success: true,
            message: "All notification are marked as seen",
            data: updateUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while marking"
            , success: false,
            error
        })
    }
}

// for all 
exports.getallVendors = async (req, res) => {
    try {
        const vendor = await photographers.find({ status: "approved" })
        res.status(200).send({
            message: "Vendors data fetched succesfully",
            success: true,
            data: vendor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while fetching",
            status: false, error
        })
    }
}

// for all
exports.viewVendor = async (req, res) => {
    const { photographer_id } = req.body
    try {
        const vendor = await photographers.findById({ _id: photographer_id })
        res.status(200).send({
            message: "Fetched Vendor ",
            success: true,
            data: vendor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while fetching",
            status: false, error
        })
    }
}

// for vendors
exports.bookings = async (req, res) => {
    try {
        req.body.status = "pending";
        const newbookings = new bookings(req.body);
        newbookings.save();

        const theUser = await users.findById({ _id: req.body.vendorInfo.userId });
        theUser.unseenNotification.push({
            type: "new-booking-request",
            message: `A new booking request has been made by ${req.body.userInfo.username}`,
            onClickPath: '/vendor/bookings'
        })

        await theUser.save();
        res.status(200).send({
            message: "Book request has been succesfully",
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while booking",
            error
        })
    }
}

// for user
exports.bookingByuser = async (req, res) => {
    const userId = req.payload;
    try {
        const booking = await bookings.find({ userId: userId });
        res.status(200).send({
            message: "Bookings fetched succesfully",
            success: true,
            data: booking
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting appoinments",
            success: false,
            error,
        });
    }
}

//for vendor
exports.bookingsForVendor = async (req, res) => {
    const userId = req.payload;
    try {
        const vendor = await photographers.findOne({ userId })
        const booking = await bookings.find({ photographerId: vendor._id });
        res.status(200).send({
            message: "bookings fetched successfully",
            success: true,
            data: booking,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting appoinments",
            success: false,
            error,
        });
    }
}

//for vendor
exports.changebookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;
    try {
        const booking = await bookings.findByIdAndUpdate(bookingId, { status });

        const theuser = await users.findOne({ _id: booking.userId })
        const unseenNotification = theuser.unseenNotification;
        unseenNotification.push({
            type: "booking status changed",
            message: `Your Booking status has been ${status}`,
            onClickPath: '/bookings'
        })
        await theuser.save();

        res.status(200).send({
            message: "Booking status updated successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting appoinments",
            success: false,
            error,
        });
    }
}