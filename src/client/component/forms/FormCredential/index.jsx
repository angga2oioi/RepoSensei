//@ts-check
import React from "react";
import { PasswordInput, Textarea, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";
import SelectCredentialType from "../../selects/SelectCredentialType";
import { USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";

const FormCredential = ({ isLoading, onSubmit }) => {
    const [formType, setFormType] = React.useState("")

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            type: "",
            name: "",
            username: "",
            password: ""
        },
        validate: {
            type: (value) => value ? null : 'type cannot empty',
            name: (value) => value ? null : 'name cannot empty',
        },
        onValuesChange: (values) => {
            setFormType(values?.type)
        },
    });

    return (
        <>
            <form
                className="w-full space-y-2"
                onSubmit={form.onSubmit(onSubmit)}
            >
                <SelectCredentialType
                    withAsterisk
                    label={`Select type`}
                    key={form.key('type')}
                    {...form.getInputProps('type')}
                />
                <TextInput
                    withAsterisk
                    label="name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                {
                    formType === USERNAME_PASSWORD_CREDENTIAL_TYPE &&
                    <>
                        <TextInput
                            withAsterisk
                            label="Username"
                            key={form.key('username')}
                            {...form.getInputProps('username')}
                        />
                        <PasswordInput
                            withAsterisk
                            label="Password"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                    </>
                }
                <div className="flex justify-end w-full">
                    <PrimaryButton
                        type="submit"
                        disabled={isLoading}
                    >Submit</PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default FormCredential