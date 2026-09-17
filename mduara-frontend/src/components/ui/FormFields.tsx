import React from 'react';
import { useField, useFormikContext } from 'formik';

import { Button } from './Button';
import { Input } from './Input';

interface AppFormFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
    secureTextEntry?: boolean;
}

interface AppFormSubmitButtonProps {
    title: string;
    loading?: boolean;
}

export function AppFormField({ keyboardType, label, name, placeholder, secureTextEntry }: AppFormFieldProps) {
    const [field, meta, helpers] = useField(name);
    const shouldShowError = meta.touched && !!meta.error;

    return (
        <Input
            error={shouldShowError ? meta.error : undefined}
            keyboardType={keyboardType}
            label={label}
            onBlur={() => helpers.setTouched(true)}
            onChangeText={helpers.setValue}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={String(field.value ?? '')}
        />
    );
}

export function AppFormSubmitButton({ loading, title }: AppFormSubmitButtonProps) {
    const { submitForm } = useFormikContext();

    return <Button fullWidth loading={loading} onPress={submitForm}>{title}</Button>;
}