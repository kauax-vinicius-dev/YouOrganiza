import { hardwareItemsExchange } from '../models/hardwareItemsExchangeModel.js';

export class WithdrawalController {
    static async getAllWithdrawals(req, res) {
        try {
            const withdrawals = await hardwareItemsExchange.find().sort({ date: -1 });
            return res.status(200).json(withdrawals);
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao buscar retiradas' });
        }
    }
}
