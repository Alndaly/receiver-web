import { API_PREFIX } from "@/config/api"

export default {
    createAPIKey: API_PREFIX + '/apikey/create',
    deleteAPIKey: API_PREFIX + '/apikey/delete',
    searchAPIKey: API_PREFIX + '/apikey/search',
} 