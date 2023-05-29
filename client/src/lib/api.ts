import axios from "axios"
import qs from 'qs'

export async function getApi(path: string, data: any = null) {
    return data == null 
        ? await axios.get(`http://localhost:4000/api/${path}`)
        : await axios.get(`http://localhost:4000/api/${path}?${qs.stringify(data)}`)
}

export async function postApi(path: string, data: any = { }) {
    return await axios.post(`http://localhost:4000/api/${path}`, data)
}