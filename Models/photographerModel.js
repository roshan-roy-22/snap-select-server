const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    coverImage: {
        type: Array,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    genres: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        required: true
    },
    photos: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
}, {
    timestamps: true
});

const photographers = mongoose.model('photographers', photographerSchema);

module.exports = photographers;
