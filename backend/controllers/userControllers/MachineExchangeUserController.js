import { machineExchangeService } from "../../services/MachineExchangeService.js";

export class machineExchangeUserController {
    static async createMachineExchange(req, res) {
        try {
            const {
                replacedMachineSerialNumber,
                replacedMachinecurrentOperation,
                newMachineSerialNumber,
                OperationCurrentNewMachine,
                observation,
                technicianName,
            } = req.body;

            await machineExchangeService.createMachineExchange({
                replacedMachineSerialNumber,
                replacedMachinecurrentOperation,
                newMachineSerialNumber,
                OperationCurrentNewMachine,
                observation,
                technicianName,
            });
            return res.status(201).json({
                msg: 'Troca de máquina registrada com sucesso'
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }

    static async getAllMachineExchanges(req, res) {
        try {
            const machineExchanges = await machineExchangeService.getAllMachineExchanges();
            res.status(200).json(machineExchanges);
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}