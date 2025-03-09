//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createCredential } from "@/client/api/credential"
import FormRepository from "../../forms/FormRepository"
import { connectRepository } from "@/client/api/repositories"

const ModalManageRepository = ({ title, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            const { hostname, protocol } = window.location
            await connectRepository({
                ...e,
                hostname,
                protocol
            })
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Modal opened={true} onClose={onCancel} title={title}>
                <FormRepository
                    isLoading={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    )
}
export default ModalManageRepository