//@ts-check
import { listAllCredential } from "@/client/api/credential";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { Select } from "@mantine/core";
import React from "react";
const SelectCredential = ({ ...props }) => {
    const ErrorMessage = useErrorMessage()
    const [list, setList] = React.useState(null)

    const fetchData = async () => {
        try {
            let l = await listAllCredential()
            setList(l)

        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <Select
                {...props}
                data={list?.map((n) => {
                    return {
                        value: n?.id,
                        label: n?.name
                    }
                })}
            />
        </>
    )
}

export default SelectCredential;