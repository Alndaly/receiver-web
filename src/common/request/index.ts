import { request } from './request';

/**
 * @param {string} url
 * @param {object} query
 * @returns {Promise<any>}
 * @description 发送get请求
**/
export async function get(url = '', data = {}) {
    const res = request(url, data, 'GET');
    return res
}

/**
 * @param {string} url
 * @param {object} query
 * @returns {Promise<any>}
 * @description 发送post请求
**/
export async function post(url = '', data = {}) {
    const res = request(url, data, 'POST');
    return res
}

/**
 * 将promise对象返回函数转为数组
 * @param promise
 * @returns []
 */
export function to(promise: Promise<any>): Promise<any[]> {
    return new Promise((resolve) => {
        promise.then(
            (res) => {
                return resolve([res, null])
            },
            (err) => {
                return resolve([null, err])
            }
        );
    }
    );
}
