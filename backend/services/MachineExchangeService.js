import { machineExchange } from "../models/machineExchangeModel.js";
import { machineService } from "./MachineService.js";
import { machine } from "../models/machineModel.js";
import { InputValidator } from "../validators/Validator.js";

export class machineExchangeService {
    static async createMachineExchange({
        replacedMachineSerialNumber,
        replacedMachinecurrentOperation,
        newMachineSerialNumber,
        OperationCurrentNewMachine,
        observation,
        technicianName,
    }) {
        InputValidator.checkIfFieldIsEmpty(replacedMachineSerialNumber, 'replacedMachineSerialNumber');
        InputValidator.checkIfFieldIsEmpty(replacedMachinecurrentOperation, 'replacedMachinecurrentOperation');
        InputValidator.checkIfFieldIsEmpty(technicianName, 'technicianName');
        InputValidator.hasNoNumbers(technicianName, 'technicianName');
        const replacedMachine = await machine.findOne({ serialNumber: replacedMachineSerialNumber });
        InputValidator.throwIfFalse(replacedMachine, 'numero de serie da maquina substituida incorreto');
        const newMachine = await machine.findOne({ serialNumber: newMachineSerialNumber });
        InputValidator.throwIfFalse(newMachine, 'numero de serie da nova maquina esta incorreto');
        const idReplacedMachine = replacedMachine.id;
        const idNewMachine = newMachine.id;
        const NewMachineExchange = new machineExchange({
            replacedMachineSerialNumber,
            replacedMachinecurrentOperation,
            newMachineSerialNumber,
            OperationCurrentNewMachine,
            observation,
            technicianName,
        })
        const saveMachineExchange = await NewMachineExchange.save();
        InputValidator.throwIfFalse(saveMachineExchange, 'erro ao salvar troca de maquina');
    }
    static async getAllMachineExchanges() {
        const machineExchanges = await machineExchange.find();
        InputValidator.throwIfFalse(machineExchanges, 'erro ao buscar trocas de maquinas');
        return machineExchanges;
    }
}