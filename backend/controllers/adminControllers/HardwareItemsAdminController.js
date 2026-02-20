import { hardwareItemsService } from "../../services/HardwareItemsService.js";
import { InputValidator } from "../../validators/Validator.js";


export class hardwareItemsAdminController {
    static async createHardwareItems(req, res) {
        try {
            const { itemName, amountItem } = req.body;
            InputValidator.validate({ itemName, amountItem });
            await hardwareItemsService.createHardwareItems({ itemName, amountItem });
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
            InputValidator.validate({ id });
            await hardwareItemsService.deleteHardwareItems({ id });
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
            InputValidator.validate({ id, removedItemsQuantity });
            await hardwareItemsService.withdrawHardwareItem({ id, removedItemsQuantity });
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
            await hardwareItemsService.updateHardwareItem({ id, itemName, amountItem });
            return res.status(200).json({ msg: 'Item editado com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async getAllHardwareItems(req, res) {
        try {
            const hardwareItems = await hardwareItemsService.getAllHardwareItems();
            res.status(200).json({ hardwareItems });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}