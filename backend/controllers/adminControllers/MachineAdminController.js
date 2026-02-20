import { machineService } from "../../services/MachineService.js";

export class machineAdminController {
    static async createMachine(req, res) {
        try {
            const { serialNumber, model, currentOperation, observation } = req.body;
            await machineService.createMachine({ serialNumber, model, currentOperation, observation });
            res.status(201).json({ msg: 'maquina criada com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async deleteMachine(req, res) {
        try {
            const { id } = req.params;
            await machineService.deleteMachine({ id });
            res.status(200).json({ msg: 'maquina excluida com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async updateMachine(req, res) {
        try {
            const { id, serialNumber, model, currentOperation, observation } = req.body;
            await machineService.updateMachine({ id, serialNumber, model, currentOperation, observation });
            res.status(200).json({ msg: 'maquina editada com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async getAllMachines(req, res) {
        try {
            const machines = await machineService.getAllMachines();
            res.status(200).json({ machines });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}