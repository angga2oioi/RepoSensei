//@ts-check
import { USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import { Select } from "@mantine/core";
import React from "react";
const SelectCredentialType = ({ ...props }) => {
    return (
        <>
            <Select
                {...props}
                data={[
                    USERNAME_PASSWORD_CREDENTIAL_TYPE
                ]}
            />
        </>
    )
}

export default SelectCredentialType;