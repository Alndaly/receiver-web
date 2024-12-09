export const UNIAPI_PREFIX = 'https://api.uniapi.top';
console.log(process.env.NODE_ENV, process.env.TZ)
export const API_PREFIX = process.env.NODE_ENV == 'production' ? 'https://api.receiver.qingyun.com' : 'http://localhost:8000'
export const LOGIN_WS_URL = process.env.NODE_ENV == 'production' ? 'wss://api.receiver.qingyun.com/login' : 'ws://localhost:8000/login'