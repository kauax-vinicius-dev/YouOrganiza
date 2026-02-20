import { machineService } from "../../services/MachineService.js";

export class machineUserController {
    static async getAllMachines(req, res) {
        try {
            const machines = await machineService.getAllMachines();
            res.status(200).json(machines);
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}