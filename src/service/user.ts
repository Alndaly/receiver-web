import userApi from '@/api/user'
import { get, post } from '@/common/request';
import { utils } from '@kinda/utils'

export const updateToken = async (refresh_token: string) => {
    const [res, err] = await utils.to(post(userApi.updateToken, {
        refresh_token
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

export const updateUserInfo = async (avatar: string, nickname: string, enable_notify: boolean) => {
    const [res, err] = await utils.to(post(userApi.updateUserInfo, {
        avatar,
        nickname,
        enable_notify
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