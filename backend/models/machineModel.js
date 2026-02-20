import mongoose from "mongoose";

export const machine = mongoose.model('machine', {
    serialNumber: String,
    model: String,
    currentOperation: String,
    observation: String, 
});
