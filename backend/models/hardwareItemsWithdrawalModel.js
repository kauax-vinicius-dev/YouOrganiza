import mongoose from "mongoose";

export const hardwareItemsWithdrawal = mongoose.model('hardwareItemsWithdrawal', {
    technicianName: String,
    quantityTaken: {
        type: Number,
        default: 0
    },
    withdrawnItem: String,
    date: {
        type: Date,
        default: Date.now
    },
});
