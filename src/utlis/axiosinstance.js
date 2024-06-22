import axios from "axios";
import dayjs from "dayjs"
import {jwtDecode} from "jwt-decode";


const createAxiosInstance = (role) =>{

    let token = "";
    let refresh_token = "";

    if (role == "user"){
         token = localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access')):""
         refresh_token = localStorage.getItem('refresh') ? JSON.parse(localStorage.getItem('refresh')):""
    }else if(role == "admin"){
         token = localStorage.getItem('admin_access') ? JSON.parse(localStorage.getItem('admin_access')):""
         refresh_token = localStorage.getItem('admin_refresh') ? JSON.parse(localStorage.getItem('admin_refresh')):""
    }else if (role == "theatre"){
         token = localStorage.getItem('theatre_access') ? JSON.parse(localStorage.getItem('theatre_access')):""
         refresh_token = localStorage.getItem('theatre_refresh') ? JSON.parse(localStorage.getItem('theatre_refresh')):""
    }

    const baseUrl = "http://localhost:8000/api/v1"
    const axiosInstance = axios.create({
        baseURL:baseUrl,
        'Content-type':'application/json',
        headers:{'Authorization': token ? `Bearer ${token}`:null}
    })


axiosInstance.interceptors.request.use(async req => {
    if(token){
        req.headers.Authorization = `Bearer ${token}`
        const user = jwtDecode(token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs())<1
        if(!isExpired){
            return req
        }else{
            const res = await axios.post(`${baseUrl}/auth/token/refresh/`,{'refresh':refresh_token})
            if (res.status == 200){
                localStorage.setItem('access',JSON.stringify(res.data.access))
                req.headers.Authorization = `Bearer ${res.data.access}`
                return req
            }else{
                const res = await axios.post(`${baseUrl}/auth/logout/`, { 'refresh': refresh_token });
                console.log(res.data);
                if (res.status === 200) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                   
                }
            }
        }

        
    }
    return req
})
    return axiosInstance
}

export default createAxiosInstance