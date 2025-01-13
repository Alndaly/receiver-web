import userApi from '@/api/user'
import { get, post } from '@/common/request';
import { utils } from '@kinda/utils'

export const updateToken = async (refresh_token: string) => {
    const [res, err] = await utils.to(post(userApi.updateToken, {
        refresh_token
    }))
    return [res, err]
}

export const unBindEmail = async () => {
    const [res, err] = await utils.to(post(userApi.unBindEmail))
    return [res, err]
}

export const unBindPhone = async () => {
    const [res, err] = await utils.to(post(userApi.unBindPhone))
    return [res, err]
}

export const unBindGitHub = async () => {
    const [res, err] = await utils.to(post(userApi.unBindGitHub))
    return [res, err]
}

export const unBindGoogle = async () => {
    const [res, err] = await utils.to(post(userApi.unBindGoogle))
    return [res, err]
}

export const bindEmailCode = async (email: string) => {
    const [res, err] = await utils.to(post(userApi.bindEmailCode, {
        email
    }))
    return [res, err]
}

export const bindEmailVerify = async (email: string, code: string) => {
    const [res, err] = await utils.to(post(userApi.bindEmailVerify, {
        email,
        code
    }))
    return [res, err]
}

export const bindPhoneCode = async (phone: string) => {
    const [res, err] = await utils.to(post(userApi.bindPhoneCode, {
        phone
    }))
    return [res, err]
}

export const bindPhoneVerify = async (phone: string, code: string) => {
    const [res, err] = await utils.to(post(userApi.bindPhoneVerify, {
        phone,
        code
    }))
    return [res, err]
}

export const bindGitHub = async (code: string) => {
    const [res, err] = await utils.to(post(userApi.bindGitHub, {
        code
    }))
    return [res, err]
}

export const bindGoogle = async (code: string) => {
    const [res, err] = await utils.to(post(userApi.bindGoogle, {
        code
    }))
    return [res, err]
}

export const createUserByGoogle = async (code: string) => {
    const [res, err] = await utils.to(post(userApi.createUserByGoogle, {
        code
    }))
    return [res, err]
}

export const createUserByGitHub = async (code: string) => {
    const [res, err] = await utils.to(post(userApi.createUserByGitHub, {
        code
    }))
    return [res, err]
}

export const createUserEmailCode = async (email: string) => {
    const [res, err] = await utils.to(post(userApi.createEmailCode, {
        email
    }))
    return [res, err]
}

export const createEmailUserVerify = async (nickname: string, email: string, password: string, code: string) => {
    const [res, err] = await utils.to(post(userApi.createEmailUserVerify, {
        nickname,
        email,
        password,
        code
    }))
    return [res, err]
}

export const createUserSMSCode = async (phone: string) => {
    const [res, err] = await utils.to(post(userApi.createSMSCode, {
        phone
    }))
    return [res, err]
}

export const createSMSUserVerify = async (phone: string, code: string) => {
    const [res, err] = await utils.to(post(userApi.createSMSUserVerify, {
        phone,
        code
    }))
    return [res, err]
}

export const deleteUser = async () => {
    const [res, err] = await utils.to(post(userApi.deleteUser))
    return [res, err]
}

export const loginUser = async (email: string, password: string) => {
    const [res, err] = await utils.to(post(userApi.loginUser, {
        email,
        password,
    }))
    return [res, err]
}

export const getMyInfo = async () => {
    const [res, err] = await utils.to(post(userApi.myInfo))
    return [res, err]
}

export const updateUserNickname = async (nickname: string) => {
    const [res, err] = await utils.to(post(userApi.updateUserInfo, {
        nickname,
    }))
    return [res, err]
}

export const updateUserEnableNotify = async (enableNotify: boolean) => {
    const [res, err] = await utils.to(post(userApi.updateUserInfo, {
        enable_notify: enableNotify,
    }))
    return [res, err]
}

export const updatePasswordEmailCode = async () => {
    const [res, err] = await utils.to(post(userApi.updatePasswordEmailCode))
    return [res, err]
}

export const updatePassword = async (newPassword: string, code: string) => {
    const [res, err] = await utils.to(post(userApi.updatePassword, {
        new_password: newPassword,
        code: code
    }))
    return [res, err]
}