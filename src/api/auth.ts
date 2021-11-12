import { AxiosResponse } from 'axios'
import { $axios } from '~/logic/axios'
import { token } from '~/stores/user'
import { WalineResponse } from './waline'

export interface LoginParams {
  email: string,
  password: string,
}

export interface TokenData {
  createdAt: string,
  updatedAt: string,
  display_name: string,
  email: string,
  github: string,
  mailMd5: string,
  token: string,
  type: 'administrator',
  url: string
}

export async function setAuthorization(token: string) {
  ($axios.defaults.headers as any)['Authorization'] = `Bearer ${token}`
}

/**
 * 登录
 * @param payload 
 * @returns 
 */
export async function login(payload: LoginParams, remember = true) {
  const res = await $axios.post<LoginParams, WalineResponse<TokenData>>('/token', payload)
  if (res && res.data && res.data.token) {
    const resToken = res.data.token
    setAuthorization(resToken)

    if (remember) {
      token.value = resToken
    }

    if (window.opener) {
      window.opener.postMessage(
        { type: 'userInfo', data: { remember, ...res } },
        '*'
      );
    }
  }
  return res
}


/**
 * 退出
 */
export function logout() {
  token.value = ''
}
