//@ts-check
import BreadCrumbs from "@/client/component/elements/Breadcrumbs"
import React from "react"
const DashboardViews = () => {

    return (
        <>
            <div className="w-full flex space-y-2 py-2">
                <BreadCrumbs
                    items={[
                        { title: 'Dashboard', href: '/dashboard' },
                    ]}
                />
            </div>
        </>
    )
}

export default DashboardViews