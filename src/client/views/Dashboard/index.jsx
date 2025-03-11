//@ts-check
"use client"
import BreadCrumbs from "@/client/component/elements/Breadcrumbs"
import React from "react"
import { useRepositories } from "./hooks";
import TableBuilder from "@/client/component/elements/Table";
import { Tooltip } from "@mantine/core";
import { DangerButton } from "@/client/component/buttons/DangerButton";
import { FaTrash } from "react-icons/fa";
import PaginationBuilder from "@/client/component/elements/Paginations";
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton";
import { IoDownload } from "react-icons/io5";
const DashboardViews = () => {

    const {
        list,
        repositories,
        isLoading,
        handleRemove,
        handleAnalyze,
        ConfirmDialogComponent
    } = useRepositories();

    const formattedItems = repositories.map((n) => ({
        name: n?.name,
        action:
            <>
                <Tooltip label={`Check Now`}>
                    <SecondaryButton disabled={isLoading} onClick={() => handleAnalyze(n?.id)}>
                        <IoDownload />
                    </SecondaryButton>
                </Tooltip>
                <Tooltip label="Remove">
                    <DangerButton disabled={isLoading} onClick={() => handleRemove(n?.id)}>
                        <FaTrash />
                    </DangerButton>
                </Tooltip>
            </>
    }));

    return (
        <>
            <div className="w-full flex flex-col space-y-2 py-2">
                <BreadCrumbs
                    items={[
                        { title: 'Dashboard', href: '/dashboard' },
                    ]}
                />

                <TableBuilder items={formattedItems} />
                {
                    list?.totalPages > 1 &&
                    <div className="w-full flex justify-end">
                        <PaginationBuilder total={list?.totalPages || 1} value={list?.page || 1} />
                    </div>
                }

            </div>
            <ConfirmDialogComponent />
        </>
    )
}

export default DashboardViews