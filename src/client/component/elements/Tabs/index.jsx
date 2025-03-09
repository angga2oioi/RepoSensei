//@ts-check
"use client"
import React from "react"
import { Tabs } from "@mantine/core"

const TabBuilder = ({ items }) => {
    const [activeTab, setActiveTab] = React.useState(items?.[0]?.id);

    return (
        <>
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    {
                        items?.map((n) => <Tabs.Tab key={n?.id} value={n?.id}>{n?.name}</Tabs.Tab>)
                    }
                </Tabs.List>

                {
                    items?.map((n) => <Tabs.Panel key={n?.id} value={n?.id} className="py-2">{n?.element}</Tabs.Panel>)
                }

            </Tabs>
        </>
    )
}

export default TabBuilder