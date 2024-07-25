import axios from "axios";
import { BASE_URL, HEADER } from "./config";

const service = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: HEADER
})

//请求
export const request = {
    get(url: string, params?: any){
        return service.get(url,{params})
    },
    post(url: string, data?: any){
        return service.post(url,data)
    },
    put(url: string, data?: any){
        return service.put(url, data)
    },
    delete(url: string, params?: any){
       return service.delete(url, {params}) 
    },
    uploadFile(url: string, file: Blob, fileName: string){
        const formData = new FormData();
        formData.append('file',file,fileName);

        return service.post(url, formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
        })
    }
}

//响应拦截器
service.interceptors.response.use(
    (res:any) => {
        console.log(res);
        return res.data;
    },
    (error) => {
        let message = "";
        console.error(error);
        return Promise.reject(message);
    }
)