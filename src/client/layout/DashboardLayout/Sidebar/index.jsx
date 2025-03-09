import Link from "next/link";
import { FaCogs, FaPlus } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

export default function Sidebar() {
    return (
        <div className="relative">
            <div className="p-4 h-full w-64">
                <ul className="mt-4 space-y-2">
                    <li className="p-2 hover:bg-black hover:text-white rounded cursor-pointer">
                        <span className="flex space-x-2 items-center"><FaPlus /> <span>New Item</span></span>
                    </li>
                    <li className="p-2 hover:bg-black hover:text-white rounded">
                        <span className="flex space-x-2 items-center"><FaCogs /> <span>Settings</span></span>
                    </li>
                    <li className="p-2 hover:bg-black hover:text-white rounded">
                        <Link href={`/logout`} >
                            <span className="flex space-x-2 items-center"><IoMdLogOut /> <span>Logout</span></span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
