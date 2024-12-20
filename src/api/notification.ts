import { API_PREFIX } from "@/config/api"

export default {
    sendNotification: API_PREFIX + '/notification/send',
    searchNotification: API_PREFIX + '/notification/search',
    getNotificationSummary: API_PREFIX + '/notification/summary',
    getTodayNotification: API_PREFIX + '/notification/today',
    getNotificationDetail: API_PREFIX + '/notification/detail',
}