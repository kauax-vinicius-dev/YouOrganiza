import { hardwareItemsWithdrawal } from "../models/hardwareItemsWithdrawalModel.js";
import { hardwareItems } from "../models/hardwareItemsModel.js"; 
import { hardwareItemsService } from "./HardwareItemsService.js";
import { InputValidator } from "../validators/Validator.js";

export class hardwareItemsExchangeService {
    static async createHardwareItemsWithdrawal({ id, technicianName, quantityTaken, withdrawnItem }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        InputValidator.checkIfFieldIsEmpty(technicianName, 'technicianName');
        InputValidator.checkIfFieldIsEmpty(withdrawnItem, 'withdrawnItem');
        InputValidator.checkIfFieldIsEmpty(quantityTaken, 'quantityTaken'); 
        InputValidator.hasNoNumbers(technicianName, 'technicianName');
        InputValidator.hasLetters(quantityTaken, 'quantityTaken');

        const item = await hardwareItems.findById(id);
        if (item.amountItem < quantityTaken) { 
            throw { status: 400, msg: 'Estoque insuficiente' };
        }

        await hardwareItemsService.withdrawHardwareItem({ id, removedItemsQuantity: quantityTaken });

        const newHardwareItemsWithdrawal = new hardwareItemsWithdrawal({
            technicianName,
            quantityTaken,
            withdrawnItem,
        })

        const saveHardwareItemsWithdrawal = await newHardwareItemsWithdrawal.save();
        InputValidator.throwIfFalse(saveHardwareItemsWithdrawal, 'erro ao salvar retirada')
    }

    static async deleteHardwareItemsWithdrawal({ id }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        const deletItemsWithdrawal = await hardwareItemsWithdrawal.findByIdAndDelete(id);
        InputValidator.throwIfFalse(deletItemsWithdrawal, 'erro ao apagar registro de retirada');
    }

    static async getAllHardwareItemsWithdrawals() {
        const hardwareItemsWithdrawals = await hardwareItemsWithdrawal.find();
        InputValidator.throwIfFalse(hardwareItemsWithdrawals, 'erro ao buscar retiradas');
        return hardwareItemsWithdrawals;
    }
}