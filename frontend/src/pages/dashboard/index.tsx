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
import { GenericTable } from '../../components/ui/Table';
import moment from 'moment';


export type HomeProps = {
  periods: ListPeriodProps;
  accounts: ListAccountProps;
  accountResume: AccountResumeProps;
}


export default function Dashboard({periods, accounts, accountResume}: HomeProps){
  const [selectExtrato, setSelectExtrato] = useState(null);
  
  const [period, setPeriod] = useState();
  const [account, setAccount] = useState();  
  const[periodOption, setPeriodOption] = useState<PeriodProps>();
  const[accountOption, setAccountOption] = useState<AccountProps>();
  const [accountResumeList, setAccountResumeList] =useState<any>();
  const [accountTotal, setAccountTotal] = useState();
  const [modaVisible, setModalVisible] = useState(false);
  const apiClient = setupAPIClient();
  let columns= [
    { title: 'Data', field: 'dateFormat' },
    { title: 'Categoria', field: 'category.name' },
    { title: 'Descrição', field: 'description' },
    { title: 'Valor', field: 'valorMoeda' }
  ];
  const [rest, setRest] = useState();

  function refresh(){
    if(accounts){
      let array = accounts.map((item)=> {return{...item, value: item.name + "/" + item.type}});      
      setAccountOption({value: account, setValue: setAccount, values:  array});      
    }
    if(periods){      
      let array = periods.map((item)=> {return{...item, value: item.month + "/" + item.year}});
      setPeriodOption({value: period, setValue: setPeriod,  values: array});      
    }
    load();
  }

  async function load() {
    let jsonResume = {
      expense:{
        account:{
          name: account ? account.name: accounts[0].name,
          type: account ? account.type: accounts[0].type
        }
      },
      earn:{
        account:{
          name: account ? account.name: accounts[0].name,
          type: account ? account.type: accounts[0].type
        }
      },
      period:{
        month: period ? period.month: periods[0].month,
        year: period ? period.year: periods[0].year,
      }        
    };
    let lista = (await apiClient.post('/account/resume', jsonResume)).data;
    let dados = lista.extrato.map((item, index) => {
      return {...item,
          valorMoeda: item.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        }
    });
    setAccountResumeList(dados);
    setRest({columns: columns, 
      data: dados, 
      setData: setAccountResumeList,
      options:{
        pageSize:10
      }
    });

    let resumeTotal = {
      totalGanhoMesAnterior: lista.totalEarnsLastPeriod?lista.totalEarnsLastPeriod._sum.value:0,
      totalGanhoMesAtual: lista.totalEarns?lista.totalEarns._sum.value:0,
      totalGastoMesAnterior: lista.totalExpensesLastPeriod?lista.totalExpensesLastPeriod._sum.value:0,
      totalGastoMesAtual: lista.totalExpenses?lista.totalExpenses._sum.value:0,
      saldoMesAtual: ((lista.totalEarnsLastPeriod?lista.totalEarnsLastPeriod._sum.value:0)
          -(lista.totalExpensesLastPeriod?lista.totalExpensesLastPeriod._sum.value:0))
        +
        (
          (lista.totalEarns?lista.totalEarns._sum.value:0)
          -(lista.totalExpenses?lista.totalExpenses._sum.value:0))
    };    
    setAccountTotal(resumeTotal);

  }

  useMemo(()=>{
    let lista =undefined;
    if(accountResumeList===undefined ) lista = accountResume;
    else lista = accountResumeList;
    if(lista.extrato){
      //Tratamento dos dados
      let dados = lista.extrato.map((item, index) => {
        return {...item,
            valorMoeda: item.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
          }
      });
      
      setRest({columns: columns, 
        data: dados, 
        setData: setAccountResumeList,
        options:{
          pageSize:10
        }
      });
      setAccountTotal({
        totalGanhoMesAnterior: lista.totalEarnsLastPeriod?lista.totalEarnsLastPeriod._sum.value:0,
        totalGanhoMesAtual: lista.totalEarns?lista.totalEarns._sum.value:0,
        totalGastoMesAnterior: lista.totalExpensesLastPeriod?lista.totalExpensesLastPeriod._sum.value:0,
        totalGastoMesAtual: lista.totalExpenses?lista.totalExpenses._sum.value:0,
        saldoMesAtual: ((lista.totalEarnsLastPeriod?lista.totalEarnsLastPeriod._sum.value:0)
            -(lista.totalExpensesLastPeriod?lista.totalExpensesLastPeriod._sum.value:0))
          +
          (
            (lista.totalEarns?lista.totalEarns._sum.value:0)
            -(lista.totalExpenses?lista.totalExpenses._sum.value:0))
      });
    }
    
  }, []);

  useMemo(()=>{
    refresh();
  },[account, period]);

  const montaComboPeriodo = useMemo(()=>(<CompleteComboBox {...periodOption}/>), [periodOption]);
  const montaComboConta = useMemo(()=>(<CompleteComboBox {...accountOption}/>), [accountOption]);
  const montaTabelaExtrato = useMemo(()=>{
    return(<GenericTable rest={rest} selectedRow={selectExtrato} setSelectedRow={setSelectExtrato} />);
  }, [selectExtrato, accountResumeList]);
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
            {montaComboPeriodo}
            {montaComboConta}
          </div>
          <div  className={styles.choiceTopRefresh}>
            <label className={styles.labelSaldoApresentacao}>Mês Anterior</label>
            <label className={styles.labelSaldo}>Renda:{accountTotal?accountTotal.totalGanhoMesAnterior?accountTotal.totalGanhoMesAnterior.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>
            <label className={styles.labelSaldo}>Gasto:{accountTotal?accountTotal.totalGastoMesAnterior?accountTotal.totalGastoMesAnterior.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>            
            <label className={styles.labelSaldo}></label>
          </div>
          <div  className={styles.choiceTopRefresh}>
            <label className={styles.labelSaldoApresentacao}>Mês Atual</label>
            <label className={styles.labelSaldo}>Renda:{accountTotal?accountTotal.totalGanhoMesAtual?accountTotal.totalGanhoMesAtual.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>
            <label className={styles.labelSaldo}>Gasto:{accountTotal?accountTotal.totalGastoMesAtual?accountTotal.totalGastoMesAtual.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>
            {accountTotal?accountTotal.saldoMesAtual>0?
              <label className={styles.labelSaldoGreen}>Saldo:{accountTotal?accountTotal.saldoMesAtual?accountTotal.saldoMesAtual.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>            
            :
              <label className={styles.labelSaldoRed}>Saldo:{accountTotal?accountTotal.saldoMesAtual?accountTotal.saldoMesAtual.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}):"-":"-"}</label>
            :
              <label className={styles.labelSaldo}>Saldo:-</label>}
          </div>
        </main>
        {montaTabelaExtrato}
        {modaVisible && <ModalDash isOpen={modaVisible} onRequestClose={(()=>{setModalVisible(false)})}/>}
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const responsePeriods = await apiClient.get('/period');
  const responseAccounts = await apiClient.get('/account');
  let retorno = {props:{}};
  if(responsePeriods.data) retorno.props = {...retorno.props, periods: responsePeriods.data.reverse()}
  if(responseAccounts.data) retorno.props = {...retorno.props, accounts: responseAccounts.data}

  let responseAccountResume = undefined;
  if((responsePeriods.data)&&(responseAccounts.data)){
    let jsonResume = {
      expense:{
        account:{
          name: responseAccounts.data[0].name,
          type: responseAccounts.data[0].type
        }
      },
      earn:{
        account:{
          name: responseAccounts.data[0].name,
          type: responseAccounts.data[0].type
        }
      },
      period:{
        month: responsePeriods.data[0].month,
        year: responsePeriods.data[0].year
      }
    };
    responseAccountResume = await apiClient.post('/account/resume', jsonResume)
    if(responseAccountResume) retorno.props = {...retorno.props, accountResume: responseAccountResume.data}
  }  
  
  return retorno;
})