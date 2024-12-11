import notificationApi from '@/api/notification'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const searchNotification = async (page_num: string, page_size: string, keyword: string) => {
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