//@ts-check
"use client"
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayoutViews = ({ children }) => {
    return (
        <>
            <div className="w-full h-full">
                <Header />
                <div className="w-full flex">
                    <Sidebar />
                    <div className="w-full px-3">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayoutViews