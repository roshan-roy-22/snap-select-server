const users = require("../Models/userModel");
const photographers = require("../Models/photographerModel");
// const photographers = require("../Models/photographerModel");

exports.getallPhotographers = async (req, res) => {
    try {
        const allPhotographers = await photographers.find({})
        res.status(200).send({ message: "photographer fetched succesfully", success: true, data: allPhotographers })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while fetching",
            success: false,
            error
        })
    }
}

exports.getallUser = async (req, res) => {
    try {
        const allUsers = await users.find({})
        res.status(200).send({ message: "Users fetched succesfully", success: true, data: allUsers })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while fetching",
            success: false,
            error
        })
    }
}

exports.changeAccountStatus = async (req, res) => {
    try {
        const { photographerId, status } = req.body
        console.log(photographerId);
        console.log(status);
        const vendor = await photographers.findByIdAndUpdate(photographerId, { status })

        const user = await users.findOne({ _id: vendor.userId })
        const unseenNotification = user.unseenNotification
        unseenNotification.push({
            type: "New-vendor-request-changed",
            message: `Your Vendor account has been ${status}`,
            onclickPath: "/notifications"
        })

        user.isVendor = status === "approved" ? true : false;
        await user.save();

        res.status(200).send({
            message: "Vendor status updated successfully",
            success: true,
            data: vendor,
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error fetching users",
            success: false,
            error,
        });
    }
}