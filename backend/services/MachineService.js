import { machine } from "../models/machineModel.js";
import { InputValidator } from "../validators/Validator.js";

export class machineService {
    static async createMachine({ serialNumber, model, currentOperation, observation }) {
        InputValidator.checkIfFieldIsEmpty(serialNumber, 'serialNumber');
        InputValidator.checkIfFieldIsEmpty(model, 'model');
        InputValidator.checkIfFieldIsEmpty(currentOperation, 'currentOperation');
        InputValidator.checkIfFieldIsEmpty(observation, 'observation');
        const newMachine = new machine({
            serialNumber,
            model,
            currentOperation,
            observation,
        });
        const saveMachine = await newMachine.save();
        InputValidator.throwIfFalse(saveMachine, 'erro ao salvar maquina');
    }
    static async deleteMachine({ id }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        const deleteMachine = await machine.findByIdAndDelete(id);
        InputValidator.throwIfFalse(deleteMachine, 'erro ao deletar maquina');
    }
    static async updateMachine({ id, serialNumber, model, currentOperation, observation }) {
        InputValidator.checkIfFieldIsEmpty(id, 'id');
        const updateFields = {};
        if (serialNumber !== undefined) updateFields.serialNumber = serialNumber;
        if (model !== undefined) updateFields.model = model;
        if (currentOperation !== undefined) updateFields.currentOperation = currentOperation;
        if (observation !== undefined) updateFields.observation = observation;
        const updateMachine = await machine.updateOne(
            { _id: id },
            { $set: updateFields }
        );
        InputValidator.throwIfFalse(updateMachine.matchedCount, 'erro ao atualizar valores');
    }
    static async getAllMachines() {
        const machines = await machine.find();
        InputValidator.throwIfFalse(machines, 'erro ao buscar maquinas');
        return machines;
    }
}