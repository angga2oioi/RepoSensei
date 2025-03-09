//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import FormAccount from "../../forms/FormAccount"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createCredential } from "@/client/api/credential"
import FormCredential from "../../forms/FormCredential"

const ModalManageCredential = ({ title, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await createCredential(e)
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
                <FormCredential
                    isLoading={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    )
}
export default ModalManageCredential