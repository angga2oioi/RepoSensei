//@ts-check
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";
import { paginateCredential, removeCredential } from "@/client/api/credential";

export const useCredentials = () => {
    const searchParams = useSearchParams();
    const ErrorMessage = useErrorMessage();
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const [list, setList] = useState({});
    const [credentials, setCredentials] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const query = Object.fromEntries(searchParams.entries());
            const data = await paginateCredential(query);
            setList(data);
            setCredentials(data?.results || []);
        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRemove = (id) => {

        let params = {
            title: "Remove Credential",
            message: "Are you sure you want to remove this credential? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onConfirm: async () => {
                try {
                    await removeCredential(id);
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
        credentials,
        fetchData,
        handleRemove,
        ConfirmDialogComponent
    };
};
