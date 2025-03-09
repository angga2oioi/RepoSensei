//@ts-check
import { BITBUCKET_REPO_TYPE } from "@/global/utils/constant";
import { Select } from "@mantine/core";
import React from "react";
const SelectRepositoryType = ({ ...props }) => {
    return (
        <>
            <Select
                {...props}
                data={[
                    BITBUCKET_REPO_TYPE
                ]}
            />
        </>
    )
}

export default SelectRepositoryType;