//@ts-check
import FormSettings from "@/client/component/forms/FormSettings"
import React from "react"
import { useSettings } from "./hooks"
const ManageSettings = () => {
    const {
        isLoading,
        handleUpdate,
        settings,
    } = useSettings()

    return (
        <>
            <FormSettings
                initialValues={settings}
                isLoading={isLoading}
                onSubmit={handleUpdate}
            />
        </>
    )
}

export default ManageSettings