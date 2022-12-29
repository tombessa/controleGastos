import{useState, useMemo} from 'react';
import {canSSRAuth} from "../../utils/canSSRAuth";
import Head from 'next/head';
import {Header} from '../../components/Header';
import styles from './styles.module.scss'
import { setupAPIClient } from "../../services/api";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import { ListPeriodProps, ListAccountProps, AccountResumeProps } from "../../services/apiClient";
import { ComboBox, CompleteComboBox, OptionCombo } from "../../components/ui/ComboBox";
import { GenericForm } from '../../components/ui/Form';
import MaterialTable from 'material-table';
import { AddBox, ArrowDownward } from "@material-ui/icons";
import { ThemeProvider, createTheme } from '@mui/material';

export type HomeProps = {
  periods: ListPeriodProps;
  accounts: ListAccountProps;
  accountResume: AccountResumeProps;
}


export default function Dashboard({periods, accounts, accountResume}: HomeProps){
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [period, setPeriod] = useState();
  const [account, setAccount] = useState();
  
  const[periodOption, setPeriodOption] = useState<any>();
  const[accountOption, setAccountOption] = useState<any>();

  function handleChangePeriod(event : any){    
    setPeriod(event.target.value);
  }
  function handleChangeAccount(event : any){
    setAccount(event.target.value);
  }
  const columns = [
    { title: 'Data', field: 'date' },
    { title: 'Categoria', field: 'category.name' },
    { title: 'Descrição', field: 'description' },
    { title: 'Valor', field: 'value' }
  ];

  useMemo(()=>{
    if(accounts){      
      let array = accounts.map((item)=> {return{...item, value: item.name + "/" + item.type}});
      setAccountOption({value: account, setValue: setAccount, values:  array, handleChange: handleChangeAccount});
    }
    if(periods){
      let array = periods.map((item)=> {return{...item, value: item.month + "/" + item.year}});
      setPeriod(array[1]);
      setPeriodOption({value: period, setValue: setPeriod,  values: array , handleChange: handleChangePeriod});
    }      
  }, []);
  Modal.setAppElement('#__next'); //Verificado no código do next (id)
  const defaultMaterialTheme = createTheme();
  return(
    <>
      <Head>
        <title>Painel - Controle de Gastos</title>
      </Head>
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Header/>
        <main className={styles.container}>
          <div  className={styles.choiceTop}>
            <CompleteComboBox {...periodOption}/>
            <CompleteComboBox {...accountOption}/>
          </div>
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={columns}
              data={accountResume.extrato}
              title='Extrato'
              onRowClick={(evt, selectedRow) =>
                setSelectedRow(selectedRow.tableData.id)
              }
              options={{
                search: true,
                rowStyle: rowData => ({
                  backgroundColor:
                    selectedRow === rowData.tableData.id ? '#67aeae' : '#FFF'
                })
              }}
            />
          </ThemeProvider>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const responsePeriods = await apiClient.get('/period');
  const responseAccounts = await apiClient.get('/account');
  let retorno = {props:{}};
  if(responsePeriods.data) retorno.props = {...retorno.props, periods: responsePeriods.data}
  if(responseAccounts.data) retorno.props = {...retorno.props, accounts: responseAccounts.data}

  let responseAccountResume = undefined;
  if((responsePeriods.data)&&(responseAccounts.data)){
    let jsonResume = {
      expense:{
        account:{
          name: "Inter",
          type: "Cartão de Crédito"
        }
      },
      earn:{
        account:{
          name: "Inter",
          type: "Cartão de Crédito"
        }
      },
      period:{
        month: 12,
        year: 2022
      }
    };
    responseAccountResume = await apiClient.post('/account/resume', jsonResume)
    if(responseAccountResume) retorno.props = {...retorno.props, accountResume: responseAccountResume.data}
  }  
  
  return retorno;
})