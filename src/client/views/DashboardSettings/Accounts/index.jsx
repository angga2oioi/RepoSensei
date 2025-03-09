//@ts-check
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import PaginationBuilder from "@/client/component/elements/Paginations"
import TableBuilder from "@/client/component/elements/Table"
import SearchInput from "@/client/component/inputs/SearchInput"
import ModalManageAccount from "@/client/component/modals/ModalManageAccount"
import ModalShowPassword from "@/client/component/modals/ModalShowPassword"
import { Badge, Tooltip } from "@mantine/core"
import React from "react"
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa"
import { IoReloadOutline } from "react-icons/io5";
import { useAccounts } from "./hooks"

const ManageAccounts = () => {

    const {
        list,
        accounts,
        me,
        fetchData,
        handleUpdate,
        handleReset,
        handleRemove,
        isSecretModalVisible,
        setIsSecretModalVisible,
        secretKey,
        isEditModalVisible,
        setIsEditModalVisible,
        formUpdate,
        ConfirmDialogComponent
    } = useAccounts();

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);

    const formattedAccounts = accounts.map((n) => ({
        username: n?.username,
        roles: (
            <>
                {n?.roles?.map((m, i) => (
                    <Badge key={i}>{m}</Badge>
                ))}
            </>
        ),
        action:
            n?.id !== me?.id && (
                <>
                    <Tooltip label="Reset Password">
                        <SecondaryButton onClick={() => handleReset(n?.id)}>
                            <IoReloadOutline />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label="Edit">
                        <SecondaryButton onClick={() => handleUpdate(n)}>
                            <FaPencilAlt />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label="Remove">
                        <DangerButton onClick={() => handleRemove(n?.id)}>
                            <FaTrash />
                        </DangerButton>
                    </Tooltip>
                </>
            )
    }));

    return (
        <>
            <>
                <div className="w-full flex flex-col space-y-2">
                    <div className="w-full flex justify-between">
                        <SearchInput placeholder="Search" />
                        <PrimaryButton
                            leftSection={<FaPlus />}
                            onClick={() => setIsCreateModalVisible(true)}
                        >
                            Create New Account
                        </PrimaryButton>
                    </div>
                    <div>
                        <TableBuilder items={formattedAccounts} />
                        <div className="w-full flex justify-end">
                            <PaginationBuilder total={list?.totalPages || 1} value={list?.page || 1} />
                        </div>
                    </div>
                </div>

                <ConfirmDialogComponent />

                {isCreateModalVisible && (
                    <ModalManageAccount
                        title="Create Account"
                        onCancel={() => setIsCreateModalVisible(false)}
                        onSubmit={() => {
                            setIsCreateModalVisible(false);
                            fetchData();
                        }}
                    />
                )}

                {isEditModalVisible && (
                    <ModalManageAccount
                        mode="edit"
                        title="Update Account"
                        initialValue={formUpdate}
                        onSubmit={() => {
                            setIsEditModalVisible(false);
                            fetchData();
                        }}
                        onCancel={() => setIsEditModalVisible(false)}
                    />
                )}

                {isSecretModalVisible && (
                    <ModalShowPassword
                        secretKey={secretKey}
                        onClose={() => setIsSecretModalVisible(false)}
                    />
                )}
            </>
        </>
    )
}

export default ManageAccounts