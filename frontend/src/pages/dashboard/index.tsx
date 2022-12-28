import{useState, useMemo} from 'react';
import {canSSRAuth} from "../../utils/canSSRAuth";
import Head from 'next/head';
import {Header} from '../../components/Header';
import styles from './styles.module.scss'
import { setupAPIClient } from "../../services/api";
import Modal from 'react-modal';
import MUIDataTable from 'mui-datatables';

import { toast } from "react-toastify";
import { ListPeriodProps, ListAccountProps } from "../../services/apiClient";
import { ComboBox, CompleteComboBox, OptionCombo } from "../../components/ui/ComboBox";
import { GenericForm } from '../../components/ui/Form';


export type HomeProps = {
  periods: ListPeriodProps;
  accounts: ListAccountProps;
}

export default function Dashboard({periods, accounts}: HomeProps){
  const [modaVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState();
  const [account, setAccount] = useState();

  const[periodOption, setPeriodOption] = useState();
  const[accountOption, setAccountOption] = useState();

  function handleChangePeriod(event){    
    setPeriod(event.target.value);
  }
  function handleChangeAccount(event){
    setAccount(event.target.value);
  }

  /*
  const fields = [
    {type: "email", name: "email", required: true, label: "Email", autoComplete: "email", placeholder:"abc"},
    {type: "date", name: "date", required: true, label: "Date"},
    {type: "text", name: "favorite_color", required: false, label: "Favorite color"},
    {value: period, values:periodSelect , handleChange: handleChangePeriod }
  ]
  <GenericForm url="/category" fields={fields} />
  */
  useMemo(()=>{
    if(accounts){      
      let array = accounts.map((item, index)=> {return{...item, value: item.name + "/" + item.type}});
      setAccountOption({value: account, values:  array, handleChange: handleChangeAccount});
    }
    if(periods){
      let array = periods.map((item, index)=> {return{...item, value: item.month + "/" + item.year}});      
      setPeriodOption({value: period,  values: array , handleChange: handleChangePeriod});
    }      
  }, []);
  Modal.setAppElement('#__next'); //Verificado no código do next (id)

  return(
    <>
      <Head>
        <title>Painel - Controle de Gastos</title>
      </Head>
      <div>
        <Header/>
        <main className={styles.container}>
          <div  className={styles.choiceTop}>
            <CompleteComboBox {...periodOption}/>
            <CompleteComboBox {...accountOption}/>
          </div>
        </main>        
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const responsePeriods = await apiClient.get('/period');
  const responseAccounts = await apiClient.get('/account');
  return {
      props: {
        periods: responsePeriods.data,
        accounts: responseAccounts.data,
      }
  }
})