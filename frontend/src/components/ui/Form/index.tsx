import { FormHTMLAttributes } from 'react';
import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.scss';
import { toast } from "react-toastify";
import {FieldValues, useForm, UseFormRegister} from "react-hook-form";
import { Button } from '../Button';
import { Input } from '../Input';
import {useEffect} from "react";
import {useRouter} from "next/router";

import { ChangeEventHandler } from 'react';
import { ComboBox, CompleteComboBox, OptionCombo } from '../ComboBox';

export function useConfirmRedirectIfDirty(isDirty: boolean) {
    const router = useRouter()

    // prompt the user if they try and leave with unsaved changes
    useEffect(() => {
        const warningText = 'You have unsaved changes - are you sure you wish to leave this page?';
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };
        const handleBrowseAway = () => {
            if (!isDirty) return;
            if (window.confirm(warningText)) return;
            router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [isDirty]);
}

type Props = {
    // Where to GET/POST the form data
    url: string
    fields: Array<any>
}

export type ItemFormProps = {
    type: string 
    name: string 
    required: boolean
    label: string
    autoComplete: string
    placeholder: string
}

export type SelectFormProps = {
    value: any
    setValue: ChangeEventHandler<any>
    values: Array<any>
    handleChange: ChangeEventHandler<HTMLSelectElement>    
}


// All values that come from useForm, to be used in our custom forms
export type FormProps = {
    fields: Array<ItemFormProps>
    register: UseFormRegister<FieldValues>
    isSubmitting: boolean
    errors: { [error: string]: any }
}


async function saveFormData(data: object, url: string) {
    
    try{
        const apiClient = setupAPIClient();
        await apiClient.post(url, data);
    }catch(err){
        console.log(err);
        toast.error("Erro durante o envio dos dados")
    }
}

const renderForm = ({fields, register, errors, isSubmitting}: FormProps) => {
    return <>
        {fields.map(field => {
            return <>                
                {(field.type?(<div><Input required={field.required} placeholder={field.placeholder} type={field.type} autoComplete={field.autoComplete}  /><div className={styles.error}>{errors[field.name]?.message}</div></div>):"")}                
                {(field.values? 
                    <CompleteComboBox {...field}/>
                : "")}
                
            </>
        })}

        <Button type="submit" loading={isSubmitting}>Cadastrar</Button>
    </>;
}

export function GenericForm({url, fields}: Props){
    const {register, reset, handleSubmit, setError, formState: {isSubmitting, errors, isDirty}} = useForm();

    useConfirmRedirectIfDirty(isDirty);

    const onSubmit = async (data: object) => {
        const response = await saveFormData(data, url);
    }

    return(<form key={Math.random() + 1} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {renderForm({fields, register, errors, isSubmitting})}        
    </form>);
}