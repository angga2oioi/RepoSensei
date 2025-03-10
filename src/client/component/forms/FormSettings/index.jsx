//@ts-check
import React from "react";
import { Textarea, TextInput } from "@mantine/core"
import { AI_CREDENTIAL_SETTINGS, AI_MODEL_SETTINGS } from "@/global/utils/constant";
import { PrimaryButton } from "../../buttons/PrimaryButton";

const FormSettings = ({ initialValues = null, isLoading, onSubmit }) => {
    const [form, setForm] = React.useState(initialValues)

    React.useEffect(() => {
        setForm(initialValues)
    }, [initialValues])

    return (
        <>
            <div
                className="w-full space-y-2"
            >
                {initialValues?.map((n, i) =>
                    <div key={i}>
                        {
                            n?.key === AI_MODEL_SETTINGS &&
                            <TextInput
                                withAsterisk
                                label="AI Model"
                                value={n?.value}
                                onChange={(e) => {
                                    let f = [...form]
                                    f[i].value = e?.currentTarget?.value
                                    setForm(f)
                                }}
                            />
                        }
                        {
                            n?.key === AI_CREDENTIAL_SETTINGS &&
                            <Textarea
                                withAsterisk
                                rows={6}
                                label="AI Credential"
                                value={n?.value}
                                onChange={(e) => {
                                    let f = [...form]
                                    f[i].value = e?.currentTarget?.value
                                    setForm(f)
                                }}
                            />
                        }
                    </div>)}
                <div className="flex justify-start w-full">
                    <PrimaryButton
                        disabled={isLoading}
                        onClick={() => {
                            onSubmit(form)
                        }}
                    >Submit</PrimaryButton>
                </div>
            </div>
        </>
    )
}

export default FormSettings