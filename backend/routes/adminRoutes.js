import { Router } from "express";
import { hardwareItemsAdminController } from "../controllers/adminControllers/HardwareItemsAdminController.js";
import { hardwareItemsExchangeAdminController } from "../controllers/adminControllers/HardwareItemsWithdrawalAdminController.js";
import { machineAdminController } from "../controllers/adminControllers/MachineAdminController.js";
import { machineExchangeAdminController } from "../controllers/adminControllers/MachineExchangeAdminController.js";
import { AuthMiddleware } from "../middlewares/checkAuthenticated.js";
import { AuthController } from "../controllers/AuthController.js";
import { NotificationController } from "../controllers/adminControllers/NotificationController.js";

const adminRoutes = Router();
adminRoutes.use(AuthMiddleware.authenticate);
adminRoutes.use(AuthMiddleware.isAdmin);

adminRoutes.post('/hardware-items', hardwareItemsAdminController.createHardwareItems);
adminRoutes.post('/hardware-items-withdrawals', hardwareItemsExchangeAdminController.createHardwareItemsWithdrawal);
adminRoutes.post('/machines', machineAdminController.createMachine);
adminRoutes.post('/machine-exchanges', machineExchangeAdminController.createMachineExchange);
adminRoutes.post('/users', AuthController.createUser);

adminRoutes.get('/hardware-items', hardwareItemsAdminController.getAllHardwareItems);
adminRoutes.get('/hardware-items-withdrawals', hardwareItemsExchangeAdminController.getAllHardwareItemsWithdrawals);
adminRoutes.get('/machines', machineAdminController.getAllMachines);
adminRoutes.get('/machine-exchanges', machineExchangeAdminController.getAllMachineExchanges);
adminRoutes.get('/notifications', NotificationController.getAllNotification);

adminRoutes.patch('/hardware-items', hardwareItemsAdminController.updateHardwareItems);
adminRoutes.patch('/hardware-items/withdraw', hardwareItemsAdminController.withdrawHardwareItems);
adminRoutes.patch('/machines', machineAdminController.updateMachine);
adminRoutes.patch('/notifications/:id/read', NotificationController.markAsRead);
adminRoutes.patch('/notifications/read-all', NotificationController.markAllAsRead);

adminRoutes.delete('/hardware-items/:id', hardwareItemsAdminController.deleteHardwareItems);
adminRoutes.delete('/hardware-items-withdrawals/:id', hardwareItemsExchangeAdminController.deleteHardwareItemsWithdrawal);
adminRoutes.delete('/machines/:id', machineAdminController.deleteMachine);
adminRoutes.delete('/notifications/:id', NotificationController.deleteNotification);
adminRoutes.delete('/notifications', NotificationController.deleteAllNotifications);

export default adminRoutes;