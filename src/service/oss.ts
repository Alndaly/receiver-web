import OSS_APIS from "@/api/oss";
import { post, to } from "@/common/request";
import OSS from 'ali-oss';
import { bucket, region } from "@/config/oss";

// 注意如果是浏览器端要支持上传，那么一定要配置oss的跨域

export const initOSSClient = async () => {
    const [res, err] = await to(post(OSS_APIS.STS_API));
    if (err) {
        console.error('获取临时访问凭证失败')
        return;
    }
    const client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为cn-hangzhou。
        region: region,
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: res.access_key_id,
        accessKeySecret: res.access_key_secret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: res.security_token,
        // 刷新临时访问凭证的时间间隔，单位为毫秒。
        refreshSTSTokenInterval: 3600,
        // 填写Bucket名称。
        bucket: bucket
    });
    return client;
}

export const getObjectURL = (client: OSS, name: string) => {
    const url = client.signatureUrl(name, {
        expires: 3600
    })
    return url
}

export const uploadFileToOSS = async (client: OSS, name: string, file: File) => {
    const [res, err] = await to(client.put(name, file, {
        headers: {
            'Content-Type': file.type
        }
    }));
    return [res, err];
}

export const downloadFileFromOSS = async (client: OSS, name: string) => {
    const [res, err] = await to(client.get(name));
    return [res, err];
}

export const getFileURLFromOSS = (client: OSS, name: string) => {
    const res = client.signatureUrl(name, {
        expires: 3600
    });
    return res;
}