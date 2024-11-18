
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    user:{
        type: String,
        required: true
    }
    
});

export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);