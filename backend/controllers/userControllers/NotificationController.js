import { user as User } from '../../models/userModel.js';
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

    // GET /notifications/prefs
    static async getNotificationPrefs(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            if (!userId) return res.status(401).json({ msg: 'Usuário não autenticado' });
            if (userId === 'admin-root') {
                // Preferências padrão para admin
                return res.status(200).json({
                    estoqueBaixo: true,
                    retiradas: true,
                    trocas: true,
                    novasMaquinas: true
                });
            }
            const found = await User.findById(userId).select('notificationPrefs');
            if (!found) return res.status(404).json({ msg: 'Usuário não encontrado' });
            return res.status(200).json(found.notificationPrefs || {});
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao buscar preferências' });
        }
    }

    // PUT /notifications/prefs
    static async updateNotificationPrefs(req, res) {
        try {
            const userId = req.user._id || req.user.id;
            if (!userId) return res.status(401).json({ msg: 'Usuário não autenticado' });
            const prefs = req.body;
            if (userId === 'admin-root') {
                // Preferências padrão para admin, não salva no banco
                return res.status(200).json({
                    estoqueBaixo: prefs.estoqueBaixo ?? true,
                    retiradas: prefs.retiradas ?? true,
                    trocas: prefs.trocas ?? true,
                    novasMaquinas: prefs.novasMaquinas ?? true
                });
            }
            const found = await User.findById(userId);
            if (!found) return res.status(404).json({ msg: 'Usuário não encontrado' });
            found.notificationPrefs = {
                ...found.notificationPrefs,
                ...prefs
            };
            await found.save();
            return res.status(200).json(found.notificationPrefs);
        } catch (error) {
            return res.status(500).json({ msg: 'Erro ao atualizar preferências' });
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
