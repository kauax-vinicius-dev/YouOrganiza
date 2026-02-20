import { hardwareItems } from "../models/hardwareItemsModel.js";
import { InputValidator } from "../validators/Validator.js";

export class HardwareItemsService {
    static async createHardwareItems({ itemName, amountItem }) {
        InputValidator.checkIfFieldIsEmpty(itemName, 'itemName');
        InputValidator.checkIfFieldIsEmpty(amountItem, 'amountItem');
        InputValidator.hasLetters(amountItem, 'amountItem');
        const existingItem = await hardwareItems.findOne({ itemName });
        InputValidator.throwIfFalse(existingItem, 'já existe item com esse nome');
        const newHardwareItems = new hardwareItems({ itemName, amountItem });
        const saveHardwareItems = await newHardwareItems.save();
        InputValidator.throwIfFalse(saveHardwareItems, 'erro ao criar item');
    }
    static async deleteHardwareItems({ id }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        const deletedItem = await hardwareItems.findByIdAndDelete(id);
        InputValidator.throwIfFalse(deletedItem, 'erro ao deletar arquivo');
    }
    static async withdrawHardwareItem({ id, removedItemsQuantity }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        InputValidator.checkIfFieldIsEmpty(removedItemsQuantity, 'removedItemsQuantity');
        const withdrawalItem = await hardwareItems.updateOne(
            { _id: id },
            { $inc: { amountItem: -removedItemsQuantity } }
        )
        InputValidator.throwIfFalse(withdrawalItem.matchedCount, 'erro ao retirar item');
    }
    static async updateHardwareItem({ id, itemName, amountItem }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        const updateFields = {};
        if (itemName !== undefined) updateFields.itemName = itemName;
        if (amountItem !== undefined) updateFields.amountItem = amountItem;
        const updateItem = await hardwareItems.updateOne(
            { _id: id },
            { $set: updateFields }
        );
        InputValidator.throwIfFalse(updateItem.matchedCount, 'erro ao atualizar item');
    }
    static async getAllHardwareItems() {
        const items = await hardwareItems.find();
        InputValidator.throwIfFalse(items, 'erro ao buscar itens');
        return items;
    }
}

export const hardwareItemsService = HardwareItemsService;
