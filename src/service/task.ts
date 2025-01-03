import taskApi from '@/api/task'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const getTaskDetail = async (task_id: string) => {
    const [res, err] = await utils.to(post(taskApi.getTaskDetail, {
        task_id: task_id
    }))
    return [res, err]
}

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

export const sendTask = async (title: string, subtitle: string, body: string) => {
    const [res, err] = await utils.to(post(taskApi.sendTask, {
        title, subtitle, body
    }))
    return [res, err]
}

export const getTaskSummary = async (duration: string) => {
    const [res, err] = await utils.to(post(taskApi.getTaskSummary, {
        duration
    }))
    return [res, err]
}

export const updateTask = async (task_id: number, title: string, description: string, status: string, priority: number) => {
    const [res, err] = await utils.to(post(taskApi.updateTask, {
        task_id, title, description, status, priority
    }))
    return [res, err]
}