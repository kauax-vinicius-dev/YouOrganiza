import { Router } from "express";
import { AuthMiddleware } from "../middlewares/checkAuthenticated.js";
import { hardwareItemsUserController } from "../controllers/userControllers/HardwareItemsUserController.js";
import { machineUserController } from "../controllers/userControllers/MachineUserController.js";
import { machineExchangeUserController } from "../controllers/userControllers/MachineExchangeUserController.js";
import { hardwareItemsExchangeUserController } from "../controllers/userControllers/HardwareItemsWithdrawalUserController.js";
import { NotificationController } from "../controllers/userControllers/NotificationController.js";

const userRoutes = Router();
userRoutes.use(AuthMiddleware.authenticate);

userRoutes.post('/hardware-items-withdrawals', hardwareItemsExchangeUserController.createHardwareItemsWithdrawal);
userRoutes.post('/machine-exchanges', machineExchangeUserController.createMachineExchange);

userRoutes.get('/hardware-items', hardwareItemsUserController.getAllHardwareItems);
userRoutes.get('/machines', machineUserController.getAllMachines);

userRoutes.get('/notifications', NotificationController.getAllNotification);
userRoutes.get('/notifications/prefs', NotificationController.getNotificationPrefs);
userRoutes.put('/notifications/prefs', NotificationController.updateNotificationPrefs);

userRoutes.patch('/notifications/:id/read', NotificationController.markAsRead);
userRoutes.patch('/hardware-items', hardwareItemsUserController.updateHardwareItems);
userRoutes.patch('/hardware-items/withdraw', hardwareItemsUserController.withdrawHardwareItems);
userRoutes.patch('/notifications/read-all', NotificationController.markAllAsRead);

userRoutes.delete('/notifications/:id', NotificationController.deleteNotification);
userRoutes.delete('/notifications', NotificationController.deleteAllNotifications);

export default userRoutes;