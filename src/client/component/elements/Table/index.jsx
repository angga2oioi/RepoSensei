//@ts-check
"use client"
import { Table } from "@mantine/core"
import React from "react"
const TableBuilder = ({ items }) => {
    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        {
                            items?.[0] &&
                            Object.keys(items?.[0])?.map((n) => <Table.Th className={`capitalize`} key={n}>{n}</Table.Th>)
                        }

                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody >
                    {items?.map((n,i) => <Table.Tr key={"row" + i}>
                        {Object.keys(n)?.map((m, k) => <Table.Td key={"col" + k} className={`space-x-2 `}>{n[m]}</Table.Td>)}
                    </Table.Tr>)}
                </Table.Tbody>
            </Table>
        </>
    )
}

export default TableBuilder