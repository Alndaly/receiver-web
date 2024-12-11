import apikeyApi from '@/api/apikey'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const createAPIKey = async (description: string) => {
    const [res, err] = await utils.to(post(apikeyApi.createAPIKey, {
        description
    }))
    return [res, err]
}


export const deleteAPIKey = async (api_key_ids: string[]) => {
    const [res, err] = await utils.to(post(apikeyApi.deleteAPIKey, {
        api_key_ids
    }))
    return [res, err]
}


export const searchAPIKey = async (keyword: string, page_num: number, page_size: number) => {
    const [res, err] = await utils.to(post(apikeyApi.searchAPIKey, {
        keyword,
        page_num,
        page_size
    }))
    return [res, err]
}
