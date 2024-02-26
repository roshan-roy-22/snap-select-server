const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    photographerId: {
        type: String,
        required: true
    },
    vendorInfo: {
        type: Object,
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
}, {
    timestamps: true 
}
)

const bookings = mongoose.model("bookings", bookingSchema)
module.exports = bookings