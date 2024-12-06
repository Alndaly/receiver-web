import { v4 as uuidv4 } from 'uuid';
import { updateToken } from '@/service/user';
import qs from 'qs';
import Cookies from 'js-cookie'

// 防止多次请求token获取接口（限制三次，三次以后直接显示账号信息错误）
let refreshTokenTimes = 0;
// 被拦截的请求数组
let subscribers: any[] = [];

// 处理被缓存的请求
function onAccessTokenFetched() {
    subscribers.forEach((callback) => {
        callback();
    });
    // 处理完后清空缓存请求数组
    subscribers = [];
}

async function refreshToken() {
    if (refreshTokenTimes >= 3) {
        console.error('登陆信息已过期，即将跳转到登陆页面');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        setTimeout(() => {
            window.location.reload()
        }, 1000)
        return;
    }
    refreshTokenTimes++;
    const refresh_token = Cookies.get('refresh_token');
    if (!refreshToken) return;
    const [res, err] = await updateToken(refresh_token as string);
    if (res) {
        Cookies.set('access_token', res.access_token, { expires: res.expires_in / 1000 });
        Cookies.set('refresh_token', res.refresh_token);
        onAccessTokenFetched();
    } else {
        refreshToken()
    }
}

// 将请求缓存到请求数组中
function addSubscriber(callback: any) {
    subscribers.push(callback)
}

const checkTokenRefreshStatus = (url: string, data: any, method: any) => {
    refreshToken();
    // 将当前的请求保存在观察者数组中
    const retryOriginalRequest = new Promise((resolve) => {
        addSubscriber(() => {
            resolve(request(url, data, method));
        });
    });
    return retryOriginalRequest;
};

export const request = (url: string, data: any, method: 'POST' | 'GET') => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Trace-Id', uuidv4())
    if (Cookies.get('access_token')) {
        headers.append('Authorization', Cookies.get('access_token')!);
    }
    return new Promise(async (resolve, reject) => {
        const options: any = {
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: headers,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
        if (method === 'POST') {
            options.body = JSON.stringify({ ...data }) // body data type must match "Content-Type" header
        }
        let finalUrl = url;
        if (method === 'GET') {
            finalUrl = finalUrl + '?' + qs.stringify(data)
        }
        const response = await fetch(finalUrl, options);
        if (!response.ok) {
            // 权限问题
            if (response.status === 401) {
                resolve(checkTokenRefreshStatus(url, data, method))
                reject(await response.text())
                return
            }
            reject(await response.json())
            return
        }
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            // 请求正常
            const backData = await response.json()
            resolve(backData)
            return;
        }
        resolve(response.json())
    })
}
