//@ts-check
import ModalChangePassword from "@/client/component/modals/ModalChangePassword";
import { Menu } from "@mantine/core"
import Link from "next/link";
import React from "react"
import { IoMdLogOut } from "react-icons/io";
import { TbLockPassword } from "react-icons/tb";

const DropdownMenu = ({ children, account }) => {
    const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false)
    return (
        <>
            <Menu shadow="md" >
                <Menu.Target>
                    {children}
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<TbLockPassword size={14} />}
                        onClick={()=>{
                            setIsPasswordModalVisible(true)
                        }}
                    >
                        Change Password
                    </Menu.Item>
                    <Link href={`/logout`}>
                        <Menu.Item
                            className="text-red-500"
                            leftSection={<IoMdLogOut size={14} />}
                        >
                            Logout
                        </Menu.Item>
                    </Link>
                </Menu.Dropdown>
            </Menu>
            {
                isPasswordModalVisible && 
                <ModalChangePassword 
                    onCancel={()=>{
                        setIsPasswordModalVisible(false)
                    }}
                    onSubmit={()=>{
                        setIsPasswordModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DropdownMenu