
import { user } from "../../models/userModel.js";
import { hardwareItemsService } from "../../services/HardwareItemsService.js";
import { InputValidator } from "../../validators/Validator.js";


export class hardwareItemsUserController {
    static async getAllUsers(req, res) {
        try {
            const users = await user.find();
            res.status(200).json(users);
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro ao buscar usuários'
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
            const { id, numberOfItemsAdded } = req.body;
            InputValidator.validate({ id, numberOfItemsAdded });
            await hardwareItemsService.updateHardwareItem({ id, numberOfItemsAdded });
            return res.status(200).json({ msg: 'Itens adicionados com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async getAllHardwareItems(req, res) {
        try {
            const hardwareItems = await hardwareItemsService.getAllHardwareItems();
            res.status(200).json(hardwareItems);
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}