
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

export function CompleteComboBox({value, setValue, values, handleChange}: SelectFormProps){  
  if(handleChange===undefined) return;
  if(values===undefined) return;
  const[montaCombo, setMontaCombo] = useState<any>();
  useEffect(() => {
    console.log(value);
    function carregaCombobox(value, values, handleChange) {
      return (<ComboBox  value={value} onChange={handleChange}>
        {values.map((item, index)=> {
            return(
            <OptionCombo key={item.id} value={item}>
                {item.value}
            </OptionCombo>
            ) 
        })}
      </ComboBox>);
    }
    setMontaCombo(carregaCombobox(value, values, handleChange));
  }, [value, setValue, values, handleChange]);
  
  return <div>{montaCombo}</div>;
}