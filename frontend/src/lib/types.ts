export interface HardwareItem {
  _id: string;
  itemName: string;
  amountItem: number;
}

export interface Withdrawal {
  _id: string;
  technicianName: string;
  quantityTaken: string;
  withdrawnItem: string;
  date: string;
}

export interface Machine {
  _id: string;
  serialNumber: string;
  model: string;
  currentOperation: string;
  observation: string;
}

export interface MachineExchange {
  _id: string;
  replacedMachineSerialNumber: string;
  replacedMachinecurrentOperation: string;
  newMachineSerialNumber: string;
  OperationCurrentNewMachine: string;
  observation: string;
  technicianName: string;
  date: string;
}

export interface SystemUser {
  _id: string;
  name: string;
  email: string;
  credential: string;
  position: string;
}
