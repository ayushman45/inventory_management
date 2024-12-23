import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    fathersName: {
        type: String,
    },
    mothersOrGuardianName:{
        type:String,
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    date: {
        type: String,
        required: true,
        default: Date.now
    },
    doc: {
        type: String,
        required: true
    },
    docId: {
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    }
    
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);