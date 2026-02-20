import mongoose from "mongoose";

export const notification = mongoose.model('notification', {
    type: {
        type: String,
        enum: ['estoque_baixo', 'retirada', 'troca_maquina', 'nova_maquina', 'novo_usuario'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
