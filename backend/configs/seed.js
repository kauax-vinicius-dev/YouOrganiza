import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { user } from '../models/userModel.js';
import { machine } from '../models/machineModel.js';
import { hardwareItems } from '../models/hardwareItemsModel.js';
import { hardwareItemsWithdrawal } from '../models/hardwareItemsWithdrawalModel.js';
import { machineExchange } from '../models/machineExchangeModel.js';
import { notification } from '../models/notificationModel.js';

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

async function seed() {
    await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPass}@cluster0.h3x40l2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Conectado ao banco de dados');

    // Usuários
    await user.deleteMany({});
    const adminHash = await bcrypt.hash('admin123', 10);
    const mariaHash = await bcrypt.hash('user123', 10);
    const joaoHash = await bcrypt.hash('user123', 10);
    await user.insertMany([
        { name: 'Henrico', credential: 'admin', email: 'henrico@email.com', password: adminHash, position: 'TI' },
        { name: 'Maria', credential: 'user', email: 'maria@email.com', password: mariaHash, position: 'RH' },
        { name: 'João', credential: 'user', email: 'joao@email.com', password: joaoHash, position: 'Financeiro' },
    ]);

    // Máquinas
    await machine.deleteMany({});
    await machine.insertMany([
        { serialNumber: 'SN001', model: 'Dell Latitude 5400', currentOperation: 'Operação A', observation: 'Troca recente' },
        { serialNumber: 'SN002', model: 'Lenovo ThinkPad X1', currentOperation: 'Operação B', observation: 'Em uso' },
        { serialNumber: 'SN003', model: 'HP EliteBook 840', currentOperation: 'Operação C', observation: 'Reserva' },
    ]);

    // Itens de hardware
    await hardwareItems.deleteMany({});
    await hardwareItems.insertMany([
        { itemName: 'Cabo de rede Cat6', amountItem: 50 },
        { itemName: 'Mouse Logitech', amountItem: 30 },
        { itemName: 'Teclado ABNT2', amountItem: 20 },
        { itemName: 'Monitor 24"', amountItem: 10 },
        { itemName: 'Switch 8 portas', amountItem: 5 },
    ]);

    // Retiradas
    await hardwareItemsWithdrawal.deleteMany({});
    await hardwareItemsWithdrawal.insertMany([
        { technicianName: 'Maria', quantityTaken: 2, withdrawnItem: 'Cabo de rede Cat6', date: new Date() },
        { technicianName: 'João', quantityTaken: 1, withdrawnItem: 'Mouse Logitech', date: new Date() },
        { technicianName: 'Henrico', quantityTaken: 3, withdrawnItem: 'Teclado ABNT2', date: new Date() },
    ]);

    // Trocas de máquinas
    await machineExchange.deleteMany({});
    await machineExchange.insertMany([
        {
            replacedMachineSerialNumber: 'SN001',
            replacedMachinecurrentOperation: 'Operação A',
            newMachineSerialNumber: 'SN002',
            OperationCurrentNewMachine: 'Operação B',
            observation: 'Troca por defeito',
            technicianName: 'Henrico',
            date: new Date()
        },
        {
            replacedMachineSerialNumber: 'SN003',
            replacedMachinecurrentOperation: 'Operação C',
            newMachineSerialNumber: 'SN001',
            OperationCurrentNewMachine: 'Operação A',
            observation: 'Troca preventiva',
            technicianName: 'Maria',
            date: new Date()
        }
    ]);

    // Notificações
    await notification.deleteMany({});
    await notification.insertMany([
        { type: 'estoque_baixo', title: 'Estoque baixo', message: 'Cabo de rede Cat6 está com menos de 10 unidades.', read: false },
        { type: 'retirada', title: 'Retirada registrada', message: 'Maria retirou 2 cabos de rede.', read: false },
        { type: 'troca_maquina', title: 'Troca de máquina', message: 'Henrico realizou uma troca de máquina.', read: false },
        { type: 'nova_maquina', title: 'Nova máquina cadastrada', message: 'Dell Latitude 5400 foi adicionada ao sistema.', read: false },
        { type: 'novo_usuario', title: 'Novo usuário', message: 'João foi cadastrado como colaborador.', read: false },
    ]);

    console.log('Seed completo concluído!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Erro:', err);
    process.exit(1);
});
