"use strict";
// src/modules/queues/queues.constants.ts
exports.__esModule = true;
exports.SCORING = exports.ANALYTICS_JOBS = exports.NOTIFICATION_JOBS = exports.APPLICATION_JOBS = exports.QUEUE_NAMES = void 0;
exports.QUEUE_NAMES = {
    APPLICATION: 'application',
    NOTIFICATIONS: 'notifications',
    ANALYTICS: 'analytics',
    ESCROW: 'escrow',
    WALLET: 'wallet',
    SEARCH_INDEX: 'search-index'
};
exports.APPLICATION_JOBS = {
    SCREEN_CANDIDATE: 'screen-candidate',
    NOTIFY_RECRUITER: 'notify-recruiter',
    SCHEDULE_INTERVIEW: 'schedule-interview'
};
exports.NOTIFICATION_JOBS = {
    SEND_IN_APP: 'send-in-app',
    SEND_TELEGRAM: 'send-telegram',
    SEND_EMAIL: 'send-email'
};
exports.ANALYTICS_JOBS = {
    LOG_EVENT: 'log-event'
};
exports.SCORING = {
    AUTO_SHORTLIST_THRESHOLD: 70,
    AUTO_REJECT_THRESHOLD: 40
};
