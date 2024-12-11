import { API_PREFIX } from "@/config/api"

export default {
    createAPIKey: API_PREFIX + '/api_key/create',
    deleteAPIKey: API_PREFIX + '/api_key/delete',
    searchAPIKey: API_PREFIX + '/api_key/search',
} 