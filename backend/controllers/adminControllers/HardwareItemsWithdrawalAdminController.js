import { hardwareItemsExchangeService } from "../../services/HardwareItemsWithdrawalService.js";



export class hardwareItemsExchangeAdminController {
    static async createHardwareItemsWithdrawal(req, res) {
        try {
            const {
                id,
                technicianName,
                quantityTaken,
                withdrawnItem
            } = req.body;
            await hardwareItemsExchangeService.createHardwareItemsWithdrawal({
                id,
                technicianName,
                quantityTaken,
                withdrawnItem
            });
            return res.status(201).json({ msg: 'Retirada registrada com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async deleteHardwareItemsWithdrawal(req, res) {
        try {
            const { id } = req.params;
            await hardwareItemsExchangeService.deleteHardwareItemsWithdrawal({ id });
            return res.status(200).json({ msg: 'Registro de retirada removido com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async getAllHardwareItemsWithdrawals(req, res) {
        try {
            const hardwareItemsWithdrawals = await hardwareItemsExchangeService.getAllHardwareItemsWithdrawals();
            res.status(200).json({ hardwareItemsWithdrawals });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }

}
