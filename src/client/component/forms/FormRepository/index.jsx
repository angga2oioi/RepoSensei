//@ts-check
import React from "react";
import { TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { BITBUCKET_REPO_TYPE } from "@/global/utils/constant";
import SelectRepositoryType from "../../selects/SelectRepositoryType";
import SelectCredential from "../../selects/SelectCredential";

const FormRepository = ({ isLoading, onSubmit }) => {
    const [formType, setFormType] = React.useState("")

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            type: "",
            name: "",
            secret: "",
            gitUrl: "",
        },
        validate: {
            type: (value) => value ? null : 'type cannot empty',
            name: (value) => value ? null : 'name cannot empty',
            secret: (value) => value ? null : 'name cannot empty',
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
                <TextInput
                    withAsterisk
                    label="Enter connection Name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <SelectRepositoryType
                    withAsterisk
                    label={`Select type`}
                    key={form.key('type')}
                    {...form.getInputProps('type')}
                />
                <SelectCredential
                    withAsterisk
                    label={`Select Secret`}
                    key={form.key('secret')}
                    {...form.getInputProps('secret')}
                />

                {
                    formType === BITBUCKET_REPO_TYPE &&
                    <>
                        <TextInput
                            withAsterisk
                            label="Bitbucket Git URL"
                            key={form.key('gitUrl')}
                            {...form.getInputProps('gitUrl')}
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

export default FormRepository