import mongoose from "mongoose";

export const machineExchange = mongoose.model('machineExchange', {
    replacedMachineSerialNumber: String,
    replacedMachinecurrentOperation: String,
    newMachineSerialNumber: String,
    OperationCurrentNewMachine: String,
    observation: String,
    technicianName: String,
    date: {
        type: Date,
        default: Date.now
    },
});
