//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const paginateAccount = async (params) => {

    const { data } = await Axios.get(`/v1/accounts`, {
        params
    })
    return data.data

}

export const createAccount = async (payload) => {

    const { data } = await Axios.post(`/v1/accounts`, payload)
    return data.data

}

export const changeMyPassword = async (payload) => {

    const { data } = await Axios.patch(`/v1/accounts/me/password`, payload)
    return data.data

}

export const updateAccount = async (id, payload) => {

    const { data } = await Axios.put(`/v1/accounts/${id}`, payload)
    return data.data

}

export const removeAccount = async (id) => {

    const { data } = await Axios.delete(`/v1/accounts/${id}`)
    return data.data

}

export const resetAccountPassword = async (id) => {

    const { data } = await Axios.patch(`/v1/accounts/${id}/reset-password`)
    return data.data

}
