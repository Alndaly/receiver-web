import notificationApi from '@/api/notification'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const getTodayNotification = async () => {
    const [res, err] = await utils.to(post(notificationApi.getTodayNotification))
    return [res, err]
}

export const searchNotification = async (keyword: string, page_num: number, page_size: number) => {
    const [res, err] = await utils.to(post(notificationApi.searchNotification, {
        page_num, page_size, keyword
    }))
    return [res, err]
}

export const sendNotification = async (title: string, subtitle: string, body: string, custom_data: any) => {
    const [res, err] = await utils.to(post(notificationApi.sendNotification, {
        title, subtitle, body, custom_data
    }))
    return [res, err]
}

export const getNotificationSummary = async (duration: string) => {
    const [res, err] = await utils.to(post(notificationApi.getNotificationSummary, {
        duration
    }))
    return [res, err]
}