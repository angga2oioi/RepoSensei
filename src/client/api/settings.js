//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const updateSettings = async (payload) => {

    const { data } = await Axios.post(`/v1/settings`, payload)
    return data.data

}

export const listSettings = async () => {

    const { data } = await Axios.get(`/v1/settings`)
    return data.data

}
