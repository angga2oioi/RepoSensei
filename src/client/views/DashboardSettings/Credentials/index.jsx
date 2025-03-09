//@ts-check
import React from "react"
import { useCredentials } from "./hooks";
import { Tooltip } from "@mantine/core";
import { DangerButton } from "@/client/component/buttons/DangerButton";
import { FaPlus, FaTrash } from "react-icons/fa";
import SearchInput from "@/client/component/inputs/SearchInput";
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton";
import TableBuilder from "@/client/component/elements/Table";
import PaginationBuilder from "@/client/component/elements/Paginations";
import ModalManageCredential from "@/client/component/modals/ModalManageCredential";
const ManageCredentials = () => {

    const {
        list,
        credentials,
        fetchData,
        handleRemove,
        ConfirmDialogComponent
    } = useCredentials();

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);

    const formattedItems = credentials.map((n) => ({
        name: n?.name,
        action:
            <>
                <Tooltip label="Remove">
                    <DangerButton onClick={() => handleRemove(n?.id)}>
                        <FaTrash />
                    </DangerButton>
                </Tooltip>
            </>
    }));

    return (
        <>
            <div className="w-full flex flex-col space-y-2">
                <div className="w-full flex justify-between">
                    <SearchInput placeholder="Search" />
                    <PrimaryButton
                        leftSection={<FaPlus />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Create New Credential
                    </PrimaryButton>
                </div>
                <div>
                    <TableBuilder items={formattedItems} />
                    <div className="w-full flex justify-end">
                        <PaginationBuilder total={list?.totalPages || 1} value={list?.page || 1} />
                    </div>
                </div>
            </div>

            <ConfirmDialogComponent />

            {isCreateModalVisible && (
                <ModalManageCredential
                    title="Create Credential"
                    onCancel={() => setIsCreateModalVisible(false)}
                    onSubmit={() => {
                        setIsCreateModalVisible(false);
                        fetchData();
                    }}
                />
            )}

        </>
    )
}

export default ManageCredentials