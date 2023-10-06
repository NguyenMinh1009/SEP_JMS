import axios from "axios";

const APIClientInstance = axios.create({
  baseURL: "http://localhost:5206/api/",
  headers: {
    Accept: "application/json"
    // Authorization: `Bearer ${currentCustomer.token}`,
  }
});

APIClientInstance.interceptors.request.use(
  config => {
    const user = localStorage.getItem("user");
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

APIClientInstance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
		localStorage.removeItem('user')
		dispatchEvent(new Event("storage"))
    }
    return Promise.reject(error);
  }
);

export default APIClientInstance;
