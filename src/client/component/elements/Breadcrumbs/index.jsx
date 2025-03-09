//@ts-check
import React from "react";
import { Anchor, Breadcrumbs } from "@mantine/core";

const BreadCrumbs = ({ items }) => {
    const crumbs = items.map((item, index) => (
        <Anchor
            href={item.href}
            key={index}
            className="!text-black"
        >
            {item.title}
        </Anchor>
    ));

    return (
        <>
            <Breadcrumbs
                className="px-3 py-4 bg-gray-200 w-full rounded-sm"
            >{crumbs}</Breadcrumbs>
        </>
    )
}

export default BreadCrumbs