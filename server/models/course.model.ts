import mongoose, { Document, Model, Schema } from "mongoose";
import dotenv from "dotenv";
import { IUser } from "./user.model";

dotenv.config();

interface IComment extends Document {
    question: string;
    user: IUser;
    questionReplies?: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies:IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: string;
    videoLength: number;
    videoSection: string;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

export interface ICourse extends Document {
    _id: string;
    name: string;
    description: string;
    categories:string;
    price: number;
    estimatedPrice?: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased: number;
}

// Review Schema
const reviewSchema: Schema<IReview> = new mongoose.Schema({
    user: {
        type: Object,
        required: [true, "User information is required"],
    },
    rating: {
        type: Number,
        default: 0,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
        trim: true,
    },
    commentReplies:[Object],
},{timestamps:true});

// Link Schema
const linkSchema: Schema<ILink> = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Link title is required"],
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    },
});

// Comment Schema
const commentSchema: Schema<IComment> = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
    },
    user: {
        type: Object,
        required: [true, "User information is required"],
    },
    questionReplies: [Object],
},{timestamps:true});

// Course Data Schema
const courseDataSchema: Schema<ICourseData> = new mongoose.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});
// Course Schema
const courseSchema: Schema<ICourse> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your course name"],
        maxLength: [100, "Course name cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please provide a course description"],
    },
    categories:{
        type:String,
        required:[true, "Please provide a course categories"],
    },
    price: {
        type: Number,
        required: [true, "Please enter the course price"],
        min: [0, "Price cannot be negative"],
    },
    estimatedPrice: {
        type: Number,
        min: [0, "Estimated price cannot be negative"],
    },
    thumbnail: {
        public_id: {
            type: String,
            // required: [true, "Thumbnail public_id is required"], just for checking api
        },
        url: {
            type: String,
            // required: [true, "Thumbnail URL is required"], just for checking api
        },
    },
    tags: {
        type: String,
        required: [true, "At least one tag is required"],
    },
    level: {
        type: String,
        required: [true, "Course level is required"],
    },
    demoUrl: {
        type: String,
        required: [true, "Demo URL is required"],
    },
    benefits: [
        {
            title: {
                type: String,
                required: [true, "Benefit title is required"],
            },
        },
    ],
    prerequisites: [
        {
            title: {
                type: String,
                required: [true, "Prerequisite title is required"],
            },
        },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
        min: [0, "Ratings cannot be negative"],
        max: [5, "Ratings cannot exceed 5"],
    },
    purchased: {
        type: Number,
        default: 0,
        min: [0, "Purchased count cannot be negative"],
    },
},{timestamps:true});

const courseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
export default courseModel;
