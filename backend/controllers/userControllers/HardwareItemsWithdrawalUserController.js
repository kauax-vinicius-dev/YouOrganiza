    import { hardwareItemsExchangeService } from "../../services/HardwareItemsWithdrawalService.js";
    export class hardwareItemsExchangeUserController {
        static async getAllWithdrawals(req, res) {
            try {
                const withdrawals = await hardwareItemsExchangeService.getAllHardwareItemsWithdrawals();
                return res.status(200).json(withdrawals);
            } catch (error) {
                return res.status(error.status || 500).json({
                    msg: error.msg || 'Erro ao buscar retiradas'
                });
            }
        }

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
    }
