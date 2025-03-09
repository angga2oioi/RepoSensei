//@ts-check
import { paginateAccount, removeAccount, resetAccountPassword } from "@/client/api/account"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import PaginationBuilder from "@/client/component/elements/Paginations"
import TableBuilder from "@/client/component/elements/Table"
import SearchInput from "@/client/component/inputs/SearchInput"
import ModalManageAccount from "@/client/component/modals/ModalManageAccount"
import ModalShowPassword from "@/client/component/modals/ModalShowPassword"
import { AppContext } from "@/client/context"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { Badge, Tooltip } from "@mantine/core"
import { useSearchParams } from "next/navigation"
import React from "react"
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa"
import { IoReloadOutline } from "react-icons/io5";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"

const ManageAccounts = () => {

    const { account: me } = React.useContext(AppContext)

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const [list, setList] = React.useState({})
    const [accounts, setAccounts] = React.useState([])
    const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false)
    const [secreteKey, setSecretKey] = React.useState({})
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)
    const [formUpdate, setFormUpdate] = React.useState(null)

    const fetchData = async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())
            let l = await paginateAccount(query)
            setList(l)
            setAccounts(l?.results?.map((n) => {
                return {
                    username: n?.username,
                    roles: <>
                        {n?.roles?.map((m, i) => <Badge key={i}>{m}</Badge>)}
                    </>,
                    action: <>

                        {
                            n?.id !== me?.id &&
                            <>
                                <Tooltip label={`Reset Password`}>
                                    <SecondaryButton onClick={() => { handleReset(n?.id) }}>
                                        <IoReloadOutline />
                                    </SecondaryButton>
                                </Tooltip>
                                <Tooltip label={`Edit`}><SecondaryButton onClick={() => { handleUpdate(n) }}><FaPencilAlt /></SecondaryButton></Tooltip>
                                <Tooltip label={`remove`}><DangerButton onClick={() => { handleRemove(n?.id) }}><FaTrash /></DangerButton></Tooltip>

                            </>
                        }

                    </>
                }
            }))

        } catch (e) {
            ErrorMessage(e)
        }
    }

    const handleUpdate = async (item) => {
        setFormUpdate(item)
        setIsEditModalVisible(true)
    }

    const handleReset = async (id) => {
        try {
            let password = await resetAccountPassword(id)
            setSecretKey(password)
            setIsSecretModalVisible(true)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    const handleRemove = async (id) => {
        openConfirmDialog({
            title: 'Remove Account',
            message: 'Are you sure you want to remove this account? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeAccount(id)
                    fetchData()
                } catch (e) {
                    ErrorMessage(e)
                }
            },
            onCancel: () => console.log('Delete cancelled'),
        })
    }

    React.useEffect(() => {
        fetchData()
    }, [searchParams])

    return (
        <>
            <div className="w-full flex flex-col space-y-2">
                <div className="w-full flex justify-between">
                    <SearchInput
                        placeholder={`Search`}
                    />
                    <PrimaryButton
                        leftSection={<FaPlus />}
                        onClick={() => {
                            setIsCreateModalVisible(true)
                        }}
                    >
                        Create New Account
                    </PrimaryButton>
                </div>
                <div>
                    <TableBuilder
                        items={accounts}
                    />
                    <div className="w-full flex justify-end">
                        <PaginationBuilder
                            total={list?.totalPages || 1}
                            value={list?.page || 1}
                        />
                    </div>
                </div>
            </div>
            <ConfirmDialogComponent />
            {
                isCreateModalVisible &&
                <ModalManageAccount
                    title={`Create Account`}
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsCreateModalVisible(false)
                        fetchData()
                    }}
                />
            }
            {
                isEditModalVisible &&
                <ModalManageAccount
                    mode={"edit"}
                    title={`Update Account`}
                    initialValue={formUpdate}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        fetchData()
                    }}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                />
            }
            {
                isSecretModalVisible &&
                <ModalShowPassword
                    secretKey={secreteKey}
                    onClose={() => {
                        setIsSecretModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default ManageAccounts