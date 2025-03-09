//@ts-check
import React from "react";
import {  Textarea, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";


const FormCredential = ({ isLoading, onSubmit }) => {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: "",
            secret: "",
        },
        validate: {
            name: (value) => value ? null : 'name cannot empty',
            secret: (value) => value ? null : 'secret cannot empty'
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
                    label="name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <Textarea
                    withAsterisk
                    label="Secret"
                    placeholder="Secret"
                    {...form.getInputProps('secret')}
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

export default FormCredential