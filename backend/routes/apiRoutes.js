import { Router } from "express";
import { hardwareItemsUserController } from "../controllers/userControllers/HardwareItemsUserController.js";
import { hardwareItemsExchangeUserController } from "../controllers/userControllers/HardwareItemsWithdrawalUserController.js";
import { machineUserController } from "../controllers/userControllers/MachineUserController.js";
import { machineExchangeUserController } from "../controllers/userControllers/MachineExchangeUserController.js";
import { NotificationController } from "../controllers/userControllers/NotificationController.js";
import { AuthMiddleware } from "../middlewares/checkAuthenticated.js";

const apiRoutes = Router();
apiRoutes.use(AuthMiddleware.authenticate);


// Users
apiRoutes.get("/users", hardwareItemsUserController.getAllUsers);

// Hardware Items RESTful
apiRoutes.get("/hardware-items", hardwareItemsUserController.getAllHardwareItems);
apiRoutes.post("/hardware-items", hardwareItemsUserController.createHardwareItems ? hardwareItemsUserController.createHardwareItems : (req, res) => res.status(501).json({msg: "Not implemented"}));
apiRoutes.delete("/hardware-items/:id", hardwareItemsUserController.deleteHardwareItems ? hardwareItemsUserController.deleteHardwareItems : (req, res) => res.status(501).json({msg: "Not implemented"}));
// Withdraw/stock update
apiRoutes.put("/hardware-items/:id/withdraw", hardwareItemsUserController.withdrawHardwareItems);

// Withdrawals
apiRoutes.get("/withdrawals", hardwareItemsExchangeUserController.getAllWithdrawals ? hardwareItemsExchangeUserController.getAllWithdrawals : (req, res) => res.status(501).json({msg: "Not implemented"}));

// Machines
apiRoutes.get("/machines", machineUserController.getAllMachines);

// Machine Exchanges
apiRoutes.get("/machine-exchanges", machineExchangeUserController.getAllMachineExchanges);

// Notifications
apiRoutes.get("/notifications", NotificationController.getAllNotification);
apiRoutes.get("/notifications/prefs", NotificationController.getNotificationPrefs);
apiRoutes.put("/notifications/prefs", NotificationController.updateNotificationPrefs);
apiRoutes.patch("/notifications/:id/read", NotificationController.markAsRead);
apiRoutes.patch("/notifications/read-all", NotificationController.markAllAsRead);
apiRoutes.delete("/notifications/:id", NotificationController.deleteNotification);
apiRoutes.delete("/notifications", NotificationController.deleteAllNotifications ? NotificationController.deleteAllNotifications : (req, res) => res.status(501).json({msg: "Not implemented"}));

export default apiRoutes;