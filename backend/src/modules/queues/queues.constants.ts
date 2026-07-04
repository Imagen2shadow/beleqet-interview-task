// src/modules/queues/queues.constants.ts

export const QUEUE_NAMES = {
  APPLICATION: 'application',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  ESCROW: 'escrow',
  WALLET: 'wallet',
SEARCH_INDEX: 'search-index',
} as const;

export const APPLICATION_JOBS = {
  SCREEN_CANDIDATE: 'screen-candidate',
  NOTIFY_RECRUITER: 'notify-recruiter',
  SCHEDULE_INTERVIEW: 'schedule-interview',
} as const;

export const NOTIFICATION_JOBS = {
  SEND_IN_APP: 'send-in-app',
  SEND_TELEGRAM: 'send-telegram',
  SEND_EMAIL: 'send-email',
} as const;

export const ANALYTICS_JOBS = {
  LOG_EVENT: 'log-event',
} as const;

export const SCORING = {
  AUTO_SHORTLIST_THRESHOLD: 70,
  AUTO_REJECT_THRESHOLD: 40,
} as const;