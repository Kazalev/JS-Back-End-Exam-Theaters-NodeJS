const mongoose = require('mongoose');
const { Schema, model: Model } = mongoose;
const { String, ObjectId } = Schema.Types;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    likedPlays: [{
        type: ObjectId,
        ref: "Play",
        minlength: 3
    }]
});


userSchema.methods = {
    passwordsMatch(password){
        return bcrypt.compare(password, this.password);
    }
}

// Hook
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(11, (err, salt) => {

            if (err) {
                return next(err);
            }

            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }

                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = new Model('User', userSchema);