import { notification } from '../models/notificationModel.js';

export class NotificationService {
    static async create({ type, title, message }) {
        const notif = new notification({ type, title, message });
        await notif.save();
        return notif;
    }

    static async getAll({ page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;
        const [notifications, total, unreadCount] = await Promise.all([
            notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            notification.countDocuments(),
            notification.countDocuments({ read: false }),
        ]);
        return { notifications, total, unreadCount };
    }

    static async markAsRead(id) {
        await notification.findByIdAndUpdate(id, { read: true });
    }

    static async markAllAsRead() {
        await notification.updateMany({ read: false }, { read: true });
    }

    static async delete(id) {
        await notification.findByIdAndDelete(id);
    }

    static async deleteAll() {
        await notification.deleteMany({});
    }
}
