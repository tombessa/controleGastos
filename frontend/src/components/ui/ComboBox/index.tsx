
import { SelectHTMLAttributes, OptionHTMLAttributes, useEffect } from 'react';
import { SelectFormProps } from '../Form';
import styles from './styles.module.scss';
import {useMemo, useState} from 'react';

interface ComboBoxProps extends SelectHTMLAttributes<HTMLSelectElement>{}
interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement>{}

export function OptionCombo({...rest}: OptionProps){
  return(<option {...rest} />)
}

export function ComboBox({...rest}: ComboBoxProps){
  return(    
    <select className={styles.select} {...rest} />
  )
}

export function CompleteComboBox({value, setValue, values}: SelectFormProps){
  if(values===undefined) return;
  return ((<ComboBox  value={value?value.id:undefined} onChange={((event)=>{setValue(values.filter(t=>t.id===event.target.value)[0])})}>
    {values.map((item, index)=> {
        return(
        <OptionCombo key={item.id} value={item.id}>
            {item.value}
        </OptionCombo>
        ) 
    })}
  </ComboBox>));
}