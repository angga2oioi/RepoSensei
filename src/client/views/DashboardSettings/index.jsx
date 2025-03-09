//@ts-check
"use client"
import BreadCrumbs from "@/client/component/elements/Breadcrumbs"
import TabBuilder from "@/client/component/elements/Tabs"
import React from "react"
import ManageAccounts from "./Accounts"
import ManageCredentials from "./Credentials"
import ManageSettings from "./Settings"

const DashboardSettingsViews = () => {


    return (
        <>
            <div className="w-full flex flex-col space-y-2 py-2">
                <BreadCrumbs
                    items={[
                        { title: 'Dashboard', href: '/dashboard' },
                        { title: 'Settings', href: '/dashboard/settings' },
                    ]}
                />
                <TabBuilder
                    items={
                        [
                            {
                                id: "account",
                                name: "Accounts",
                                element: <ManageAccounts />
                            },
                            {
                                id: "credential",
                                name: "Credentials",
                                element: <ManageCredentials />
                            },
                            {
                                id: "setting",
                                name: "Settings",
                                element: <ManageSettings />
                            }
                        ]
                    }
                />
            </div>
        </>
    )
}

export default DashboardSettingsViews