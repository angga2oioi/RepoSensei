//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { changeMyPassword, } from "@/client/api/account"
import FormPassword from "../../forms/FormPassword"
import { passwordStrength } from 'check-password-strength'
import { STRONG_PASSWORD_SCORE } from "@/global/utils/constant"

const ModalChangePassword = ({ onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleChangePassword = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            let strength = passwordStrength(e?.newpassword).value;
            if (strength !== STRONG_PASSWORD_SCORE) {
                throw new Error(`Your password is ${strength}, please create a ${STRONG_PASSWORD_SCORE} password`)
            }

            await changeMyPassword(e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <>
            <Modal opened={true} onClose={onCancel} title={`Change Password`}>
                <FormPassword
                    isLoading={isSubmitting}
                    onSubmit={handleChangePassword}
                />
            </Modal>
        </>
    )
}
export default ModalChangePassword