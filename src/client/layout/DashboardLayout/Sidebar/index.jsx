import ModalManageRepository from "@/client/component/modals/ModalManageRepository";
import Link from "next/link";
import React from "react";
import { FaCogs, FaPlus } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

export default function Sidebar() {

    const [isConnectModalVisible, setIsConnectModalVisible] = React.useState(false)

    return (
        <>
            <div className="relative px-3 py-2 w-64">
                <ul className="mt-4 space-y-2">
                    <li className="p-2 hover:bg-black hover:text-white rounded cursor-pointer" onClick={() => {
                        setIsConnectModalVisible(true)
                    }}>
                        <span className="flex space-x-2 items-center"><FaPlus /> <span>New Item</span></span>
                    </li>
                    <li className="p-2 hover:bg-black hover:text-white rounded">
                        <Link href={`/dashboard/settings`} >
                            <span className="flex space-x-2 items-center"><FaCogs /> <span>Settings</span></span>
                        </Link>
                    </li>
                    <li className="p-2 hover:bg-black hover:text-white rounded">
                        <Link href={`/logout`} >
                            <span className="flex space-x-2 items-center"><IoMdLogOut /> <span>Logout</span></span>
                        </Link>
                    </li>
                </ul>
            </div>

            {
                isConnectModalVisible &&
                <ModalManageRepository
                    title={`Connect Repository`}
                    onCancel={() => {
                        setIsConnectModalVisible(false)
                    }}
                    onSubmit={() => {
                        window.location.href = "/dashboard"
                    }}
                />
            }
        </>
    );
}
