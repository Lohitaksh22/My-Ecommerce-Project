import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3500",
  withCredentials: true
})

const Interceptors = (accessToken, setAccessToken, navigate) => {
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const userRequest = error.config

      if (error.response?.status === 401 && !userRequest.retry) {
        userRequest.retry = true

        try {
          const res = await axios.post('http://localhost:3500/account/refresh', {}, {
            withCredentials: true
          })
          const newAccessToken = res.data.accessToken
          setAccessToken(newAccessToken)

          userRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(userRequest)
        } catch (err) {
          console.log("Refresh Failed", err)
          await axios.post('http://localhost:3500/account/logout', {}, { withCredentials: true })
          if (navigate) navigate('/login')
        }
      }

      return Promise.reject(error)
    }
  )
}

export default api
