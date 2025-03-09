//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const paginateRepository = async (params) => {

    const { data } = await Axios.get(`/v1/repositories`, {
        params
    })
    return data.data

}

export const connectRepository = async (payload) => {

    const { data } = await Axios.post(`/v1/repositories`, payload)
    return data.data

}

export const removeRepository = async (id) => {

    const { data } = await Axios.delete(`/v1/repositories/${id}`)
    return data.data

}