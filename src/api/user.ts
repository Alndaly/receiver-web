import { API_PREFIX } from "@/config/api"

export default {
    createEmailCode: API_PREFIX + '/user/create/email/code',
    createEmailUserVerify: API_PREFIX + '/user/create/email/verify',
    myInfo: API_PREFIX + '/user/info',
    loginUser: API_PREFIX + '/user/login',
    updateToken: API_PREFIX + '/user/token/update',
    updateUserInfo: API_PREFIX + '/user/update',
    updatePassword: API_PREFIX + '/user/password/update',
    updatePasswordEmailCode: API_PREFIX + '/user/password/update/email/code',
} 