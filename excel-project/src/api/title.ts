import { request } from "@/http"

export const searchTitle = async() =>{
    try{
        const response = await request.get("/user/excel/title");
        return response.data;
    } catch(error){
        console.error('Error title:',error);
        throw error;
    }
}