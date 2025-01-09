export const UNIAPI_PREFIX = 'https://api.uniapi.top';
// export const API_PREFIX = 'https://api.receiver.qingyon.com'
// export const LOGIN_WS_URL = 'wss://api.receiver.qingyon.com/login'
export const API_PREFIX = process.env.NODE_ENV == 'production' ? 'https://api.receiver.qingyon.com' : 'http://localhost:8000'
export const LOGIN_WS_URL = process.env.NODE_ENV == 'production' ? 'wss://api.receiver.qingyon.com/login' : 'ws://localhost:8000/login'