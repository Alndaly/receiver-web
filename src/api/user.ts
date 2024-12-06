import { API_PREFIX } from "@/config/api"

export default {
    createEmailMessage: API_PREFIX + '/user/create/email',
    createUser: API_PREFIX + '/user/create',
    myInfo: API_PREFIX + '/user/',
    loginUser: API_PREFIX + '/user/login',
    updateToken: API_PREFIX + '/user/token/update',
} 