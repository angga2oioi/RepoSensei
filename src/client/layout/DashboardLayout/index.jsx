//@ts-check
"use client"
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayoutViews = ({ children }) => {
    return (
        <>
            <div className="w-full h-full space-y-3">
                <Header />
                <div className="px-3">
                    <Sidebar />
                    <>
                        {children}
                    </>
                </div>
            </div>
        </>
    )
}

export default DashboardLayoutViews