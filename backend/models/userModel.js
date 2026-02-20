import mongoose  from "mongoose";

export const user = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    credential: String,
    position: String,
    notificationPrefs: {
        estoqueBaixo: { type: Boolean, default: true },
        retiradas: { type: Boolean, default: true },
        trocas: { type: Boolean, default: true },
        novasMaquinas: { type: Boolean, default: true }
    }
});
