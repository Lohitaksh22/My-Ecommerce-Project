import { api } from '../api'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'

const useInterceptors = () => {
  const { accessToken, setAccessToken } = useAuth()

  useEffect(() => {

    const requestIntercept = api.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`

        }
        return config
      }, (error) => Promise.reject(error)
    )


    const responseIntercept = api.interceptors.response.use(
      response => response,
      async (err) => {
        const prevRequest = err?.config
        if (err?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const res = await axios.post('http://localhost:3500/account/refresh', {}, { withCredentials: true });
          setAccessToken(res.data.accessToken);
          prevRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return api(prevRequest);
        }
        return Promise.reject(err)
      }
    )
    return () => {
      api.interceptors.request.eject(requestIntercept)
      api.interceptors.response.eject(responseIntercept)
    }
  }, [accessToken, setAccessToken])

  return api
}

export default useInterceptors
