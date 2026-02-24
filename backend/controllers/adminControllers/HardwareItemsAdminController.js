import { HardwareItemsService } from "../../services/HardwareItemsService.js";


export class hardwareItemsAdminController {
    static async createHardwareItems(req, res) {
        try {
            const { itemName, amountItem } = req.body;
            await HardwareItemsService.createHardwareItems({ itemName, amountItem });
            res.status(201).json({ msg: 'Item criado com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }

    static async deleteHardwareItems(req, res) {
        try {
            const { id } = req.params;
            await HardwareItemsService.deleteHardwareItems({ id });
            res.status(200).json({ msg: 'Item excluído com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async withdrawHardwareItems(req, res) {
        try {
            const { id, removedItemsQuantity } = req.body;
            await HardwareItemsService.withdrawHardwareItem({ id, removedItemsQuantity });
            return res.status(200).json({ msg: 'Itens retirados com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async updateHardwareItems(req, res) {
        try {
            const { id, itemName, amountItem } = req.body;
            await HardwareItemsService.updateHardwareItem({ id, itemName, amountItem });
            return res.status(200).json({ msg: 'Item editado com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async getAllHardwareItems(req, res) {
        try {
            const hardwareItems = await HardwareItemsService.getAllHardwareItems();
            res.status(200).json({ hardwareItems });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}