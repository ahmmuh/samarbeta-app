import mongoose from "mongoose";

const personSchema = mongoose.Schema({
    name: String,
    phone: String,
    email: String,
});

export default personSchema
