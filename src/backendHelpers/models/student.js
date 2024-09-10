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
    fathersName: {
        type: String,
        required: true
    },
    mothersOrGuardianName:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
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