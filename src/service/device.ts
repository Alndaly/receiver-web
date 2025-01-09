import deviceApi from '@/api/device'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const addDevcie = async (device_id: string) => {
    const [res, err] = await utils.to(post(deviceApi.addDevice, {
        device_id
    }))
    return [res, err]
}


export const getDeviceDetail = async (device_id: string) => {
    const [res, err] = await utils.to(post(deviceApi.getDeviceDetail, {
        device_id
    }))
    return [res, err]
}


export const deleteDevices = async (device_ids: string[]) => {
    const [res, err] = await utils.to(post(deviceApi.deleteDevice, {
        device_ids
    }))
    return [res, err]
}


export const searchDevice = async (page_num: number, page_size: number) => {
    const [res, err] = await utils.to(post(deviceApi.searchDevice, {
        page_num,
        page_size
    }))
    return [res, err]
}
