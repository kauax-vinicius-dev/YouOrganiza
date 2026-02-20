import mongoose from "mongoose";

export const hardwareItems = mongoose.model('hardwareItems', {
    itemName: String,
    amountItem: {
        type: Number,
        default: 0
    },
});
