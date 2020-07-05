const mongoose = require('mongoose');
const { Schema, model: Model } = mongoose;
const { String, ObjectId, Boolean } = Schema.Types;

const playSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 50
    },
    imageUrl: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        required: true
    },
    creator: {
        type: ObjectId,
        ref: "User"
    },
    usersLiked: [{
        type: ObjectId,
        ref: "User"
    }]
});

module.exports = new Model('Play', playSchema);