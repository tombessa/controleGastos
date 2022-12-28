
import { SelectHTMLAttributes, OptionHTMLAttributes } from 'react';
import { SelectFormProps } from '../Form';
import styles from './styles.module.scss';
import {useMemo} from 'react';

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

export function CompleteComboBox({...rest}: SelectFormProps){  
  if(rest===undefined) return;
  if(rest.values===undefined) return;

  const montaCombobox = useMemo(() =>(
    <ComboBox value={rest.value} onChange={rest.handleChange}>
          {rest.values.map((item, index)=> {
              return(
              <OptionCombo key={item.id} value={item.id}>
                  {item.value}
              </OptionCombo>
              ) 
          })}
    </ComboBox>
  ),[rest]);
  console.log(rest)
  return <div>{montaCombobox}</div>;
}