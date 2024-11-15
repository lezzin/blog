import { Notify } from "quasar";

const NOTIFICATION_COLORS = {
    error: 'negative',
    success: 'green',
    warning: 'orange',
}

const NOTIFICATION_ICONS = {
    error: 'error',
    success: 'check',
    warning: 'warning',
}

export function notifyUser(message, type) {
    Notify.create({
        icon: NOTIFICATION_ICONS[type],
        color: NOTIFICATION_COLORS[type],
        message: message,
        textColor: 'white',
    });
}
