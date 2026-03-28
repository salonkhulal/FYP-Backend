import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

const { Schema, model, models } = mongoose;
const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        validate: [validator.isEmail, 'This should be an valid email']
    },
    userName: {
        type: String,
        required: false,
        unique: false
    },
    provider: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: false
    },
    userRole: {
        type: [String],
        default: ['user']
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    userImage: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    rewardPoints: {
        type: Number,
        default: 0
    },
    resetPasswordLink: {
        type: String,
        default: null
    },
    resetPasswordLinkExpire: {
        type: Date,
        default: null
    }
    , status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.salt = salt;
        next();
    }
    catch (error) {
        console.log(error?.message)
    }
});

userSchema.methods.verifyPassword = async function (password) {
    try {
        const userPassword = this.password;
        const comparePassword = await bcrypt.compare(password, userPassword);
        if (comparePassword) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error?.message);
    }
};
const User = models?.User || model("User", userSchema);
export default User;