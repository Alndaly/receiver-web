import { API_PREFIX } from "@/config/api"

export default {
    sendTask: API_PREFIX + '/task/send',
    searchTask: API_PREFIX + '/task/search',
    getTaskSummary: API_PREFIX + '/task/summary',
    getTodayTask: API_PREFIX + '/task/today'
}