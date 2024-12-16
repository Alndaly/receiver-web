import authorityApi from '@/api/authority'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const searchAuthority = async (keyword: string, page_num: number, page_size: number) => {
    const [res, err] = await utils.to(post(authorityApi.searchAuthority, {
        keyword,
        page_num,
        page_size
    }))
    return [res, err]
}
