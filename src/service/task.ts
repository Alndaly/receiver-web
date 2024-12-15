import taskApi from '@/api/task'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const getTodayTask = async () => {
    const [res, err] = await utils.to(post(taskApi.getTodayTask))
    return [res, err]
}

export const searchTask = async (keyword: string, page_num: number, page_size: number) => {
    const [res, err] = await utils.to(post(taskApi.searchTask, {
        page_num, page_size, keyword
    }))
    return [res, err]
}

export const sendTask = async (title: string, subtitle: string, body: string, custom_data: any) => {
    const [res, err] = await utils.to(post(taskApi.sendTask, {
        title, subtitle, body, custom_data
    }))
    return [res, err]
}

export const getTaskSummary = async (duration: string) => {
    const [res, err] = await utils.to(post(taskApi.getTaskSummary, {
        duration
    }))
    return [res, err]
}

export const updateTask = async (id: string, title: string, description: string, status: string) => {
    const [res, err] = await utils.to(post(taskApi.updateTask, {
        id, title, description, status
    }))
    return [res, err]
}