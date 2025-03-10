//@ts-check
"use client"
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";
import { analyzeRepository, paginateRepository, removeRepository } from "@/client/api/repositories";

export const useRepositories = () => {
    const searchParams = useSearchParams();
    const ErrorMessage = useErrorMessage();
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const [list, setList] = useState({});
    const [repositories, setRepositories] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const query = Object.fromEntries(searchParams.entries());
            const data = await paginateRepository(query);
            setList(data);
            setRepositories(data?.results || []);
        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRemove = (id) => {

        let params = {
            title: "Remove Repository",
            message: "Are you sure you want to remove connection to this repository? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onConfirm: async () => {
                try {
                    await removeRepository(id);
                    fetchData();
                } catch (e) {
                    ErrorMessage(e);
                }
            }
        }

        openConfirmDialog(params);
    };

    const handleAnalyze = async (id) => {

        try {
            await analyzeRepository(id);
        } catch (e) {
            ErrorMessage(e);
        }
    };

    return {
        list,
        repositories,
        fetchData,
        handleAnalyze,
        handleRemove,
        ConfirmDialogComponent
    };
};
