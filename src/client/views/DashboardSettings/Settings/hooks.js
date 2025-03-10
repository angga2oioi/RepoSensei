//@ts-check
import { useState, useEffect, useCallback } from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { listSettings, updateSettings } from "@/client/api/settings";

export const useSettings = () => {
    const ErrorMessage = useErrorMessage();

    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const data = await listSettings();
            setSettings(data);
        } catch (e) {
            ErrorMessage(e);
        }
    }, [ErrorMessage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (forms) => {
        try {
            setIsLoading(true)
            await Promise.all(forms?.map((n) => {
                if (n?.value) {
                    return updateSettings(n)
                }
            }))
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsLoading(false)
        }
    }


    return {
        settings,
        isLoading,
        fetchData,
        handleUpdate,
    };
};
