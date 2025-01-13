import attachmentApi from '@/api/attachment'
import { post } from '@/common/request';
import { utils } from '@kinda/utils'

export const createAttachment = async (name: string, description: string) => {
    const [res, err] = await utils.to(post(attachmentApi.createAttachment, {
        name,
        description
    }))
    return [res, err]
}
