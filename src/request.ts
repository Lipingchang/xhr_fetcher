import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosPromise,
} from 'axios';
// import { State } from 'src/app.state';
import * as fse from 'fs-extra';
import { join } from 'path';

axios.defaults.timeout = 5000;

axios.defaults.headers.common = {
  Accept: '*/*',
  referer: 'http://xxxx.xxxx.xxx',
  Connection: 'keep-alive',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
};

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers.cookie = readCookie();
    config.maxContentLength = Infinity;
    config.maxBodyLength = Infinity;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// axios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     const { status } = response;
//     if (status >= 200 || status < 300) {
//       if (typeof response.data.code === 'number' && response.data.code !== 0) {
//         console.error(new Date().getTime() + ' 登录过期，请到管理页面登录');
//         State.isLogin = false;
//       }
//       return Promise.resolve(response);
//     }
//     return Promise.reject(response);
//   },
//   (error: AxiosError) => {
//     console.error(error);
//     return Promise.reject(error);
//   },
// );

export const rq = function <T>(config: AxiosRequestConfig): AxiosPromise<T> {
  return axios(config) as AxiosPromise<T>;
};

let cookie = '';
const baseJson = { cookie: '', token: '' };
const cookiePath = join(__dirname, '..', '.cookie.json');
export const readCookie = (): string => {
  if (!cookie) {
    cookie = readFile(cookiePath).cookie;
  }
  return cookie;
}
export const readToken = ():string=>{
  return readFile(cookiePath).token
}
const readFile = (path: string): CookieFile => {
  try {
    fse.ensureFileSync(path);
    let r = fse.readJsonSync(path);
    console.log(r)
    return r
  } catch (e) {
    fse.writeJsonSync(path, baseJson);
    return baseJson;
  }
};
type CookieFile = {
  cookie: string;
  token: string;
};


export const writeCookieFile = (data) => {
  fse.ensureFileSync(cookiePath);
  fse.writeJsonSync(cookiePath, data);
};