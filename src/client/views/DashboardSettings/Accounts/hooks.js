//@ts-check
import { useState, useEffect, useCallback, useContext } from "react";
import { paginateAccount, removeAccount, resetAccountPassword } from "@/client/api/account";
import { useSearchParams } from "next/navigation";
import { AppContext } from "@/client/context";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";

export const useAccounts = () => {
    const { account: me } = useContext(AppContext);
    const searchParams = useSearchParams();
    const ErrorMessage = useErrorMessage();
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const [list, setList] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [isSecretModalVisible, setIsSecretModalVisible] = useState(false);
    const [secretKey, setSecretKey] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [formUpdate, setFormUpdate] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const query = Object.fromEntries(searchParams.entries());
            const data = await paginateAccount(query);
            setList(data);
            setAccounts(data?.results || []);
        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = (item) => {
        setFormUpdate(item);
        setIsEditModalVisible(true);
    };

    const handleReset = async (id) => {
        try {
            const password = await resetAccountPassword(id);
            setSecretKey(password);
            setIsSecretModalVisible(true);
        } catch (e) {
            ErrorMessage(e);
        }
    };

    const handleRemove = (id) => {

        let params = {
            title: "Remove Account",
            message: "Are you sure you want to remove this account? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onConfirm: async () => {
                try {
                    await removeAccount(id);
                    fetchData();
                } catch (e) {
                    ErrorMessage(e);
                }
            }
        }

        openConfirmDialog(params);
    };

    return {
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
    };
};
