//@ts-check
import React from "react";
import { MultiSelect, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { MANAGE_ACCOUNT_ROLES, MANAGE_CREDENTIALS_ROLES, MANAGE_REPOSITORIES_ROLES, MANAGE_SETTINGS_ROLES } from "@/global/utils/constant";
import { AppContext } from "@/client/context";


const FormAccount = ({ initialValue = null, isLoading, onSubmit }) => {
    const { account: me } = React.useContext(AppContext)

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: initialValue?.username || "",
            roles: [],
            projects: []
        },
        validate: {
            username: (value) => value ? null : 'Username cannot empty'
        }
    });

    return (
        <>
            <form
                className="w-full space-y-2"
                onSubmit={form.onSubmit(onSubmit)}
            >

                <TextInput
                    withAsterisk
                    label="Username"
                    key={form.key('username')}
                    disabled={initialValue !== null}
                    {...form.getInputProps('username')}
                />
                <MultiSelect
                    label="Select roles"
                    placeholder="Select Roles"
                    data={[MANAGE_ACCOUNT_ROLES, MANAGE_REPOSITORIES_ROLES, MANAGE_CREDENTIALS_ROLES, MANAGE_SETTINGS_ROLES]}
                    {...form.getInputProps('roles')}
                />
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

export default FormAccount