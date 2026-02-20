import { NotificationService } from '../../services/NotificationService.js';

export class NotificationController {
    static async getAllNotification(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await NotificationService.getAll({ page, limit });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao buscar notificações' });
        }
    }

    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await NotificationService.markAsRead(id);
            return res.status(200).json({ msg: 'Notificação marcada como lida' });
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao marcar notificação' });
        }
    }

    static async markAllAsRead(req, res) {
        try {
            await NotificationService.markAllAsRead();
            return res.status(200).json({ msg: 'Todas as notificações marcadas como lidas' });
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao marcar notificações' });
        }
    }

    static async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            await NotificationService.delete(id);
            return res.status(200).json({ msg: 'Notificação deletada' });
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao deletar notificação' });
        }
    }

    static async deleteAllNotifications(req, res) {
        try {
            await NotificationService.deleteAll();
            return res.status(200).json({ msg: 'Todas as notificações deletadas' });
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao deletar todas as notificações' });
        }
    }
}
