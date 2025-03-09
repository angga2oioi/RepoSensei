//@ts-check

import axios from "axios";

const Axios = axios.create({
    baseURL: `/api`,
    withCredentials: true,
});

export const listAllCredential = async () => {
    let page = 1
    let results = []
    while (true) {
        let list = await paginateCredential({ page })
        if (list?.results?.length < 1) {
            break;
        }

        results = [
            ...results,
            ...(list?.results || [])
        ]

        page +=1
    }

    return results
}

export const paginateCredential = async (params) => {

    const { data } = await Axios.get(`/v1/credentials`, {
        params
    })
    return data.data

}

export const createCredential = async (payload) => {

    const { data } = await Axios.post(`/v1/credentials`, payload)
    return data.data

}

export const removeCredential = async (id) => {

    const { data } = await Axios.delete(`/v1/credentials/${id}`)
    return data.data

}