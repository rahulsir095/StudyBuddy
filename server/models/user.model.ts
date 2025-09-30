import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
require("dotenv").config(); 
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    }
    role: string;
    isVerified: boolean;
    isSocialAuth: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword(password: string): Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;

};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [emailRegexPattern, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: function () {
            return !this.isSocialAuth; // Only required if not a social auth user
        },
        minlength: [8, "Your password must be at least 8 characters long"],
        select: false,
        trim: true
    },
    isSocialAuth: {
        type: Boolean,
        default: false, // Social auth users will have this as true
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String
        }
    ],
},
    { timestamps: true }
);

//hash password before saving
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//sign jwt access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "5m",
    });   
};

//sign jwt refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN  || "",{
        expiresIn: "5d",
    });
}; 

//compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;