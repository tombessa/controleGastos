import React, {useState, useMemo} from 'react';
import {canSSRAuth} from "../../utils/canSSRAuth";
import Head from 'next/head';
import {Header} from '../../components/Header';
import styles from './styles.module.scss'
import { setupAPIClient } from "../../services/api";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import {ListPeriodProps, ListAccountProps, AccountResumeProps, CategoryProps} from "../../services/apiClient";
import { ComboBox, CompleteComboBox, OptionCombo } from "../../components/ui/ComboBox";
import { GenericTable } from '../../components/ui/Table';
import moment from 'moment';



export type HomeProps = {
  periods: ListPeriodProps;
  accounts: ListAccountProps;
  accountResume: AccountResumeProps;
  earns: CategoryProps;
  expenses: CategoryProps;
}


export default function Dashboard({periods, accounts, accountResume, earns, expenses}: HomeProps){
  const [selectExtrato, setSelectExtrato] = useState(null);
  const [period, setPeriod] = useState();
  const [account, setAccount] = useState();  
  const [periodOption, setPeriodOption] = useState<PeriodProps>();
  const [accountOption, setAccountOption] = useState<AccountProps>();
  const [accountResumeList, setAccountResumeList] =useState<any>();
  const [accountTotal, setAccountTotal] = useState();
  const [modaVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState();
  const [columns, setColumns]=useState([]);

  const apiClient = setupAPIClient();
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

  function returnResumeTotal(lista){
    return {
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
  }
  function returnTableColum(categoryList){
    return [
      { title: 'Data', field: 'dateFormat',
        cellStyle: { width: "10%" },
        width: "10%",
        headerStyle: { width: "10%" }},
      { title: 'Categoria', field: 'category_id', lookup: categoryList,
        cellStyle: { width: "20%" },
        width: "20%",
        headerStyle: { width: "20%" }},
      { title: 'Descrição', field: 'description',
        cellStyle: { width: "60%" },
        width: "60%",
        headerStyle: { width: "60%" }},
      { title: 'Valor', field: 'value',
        cellStyle: { width: "10%" },
        width: "10%",
        headerStyle: { width: "10%" }, type:'currency', currencySetting:{ locale: 'pt-br',currencyCode:'BRL', minimumFractionDigits:0, maximumFractionDigits:2}}
    ];
  }
  function returnJsonQuery(account, period){
    return {
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
  }

  function isEarn(category_id: string):Boolean{
    let filterEarn = earns.filter(t => t.id === category_id);
    let filterExpense = expenses.filter(t => t.id === category_id);
    return (filterEarn.length>0);
  }

  const handleRowDelete = 

  const handleRowAdd = (newData: RowData, resolve: Promise<any>) => {
    let bNewEarn=isEarn(newData.category_id);
    let dateArray = newData.dateFormat.split("/");
    let newDate = moment(new Date(dateArray[2], dateArray[1]-1, dateArray[0])).format('YYYY-MM-DD');
    newDate = newDate.concat("T06:00:00.000Z");
    let addJson = {
      category_id: newData.category_id,
      description: newData.description,
      value: newData.value,
      date: newDate,
      account: {
        name: account ? account.name: accounts[0].name,
        type: account ? account.type: accounts[0].type
      }
    };
    const add = apiClient.post((bNewEarn? '/earn' : '/expense'), addJson);
    load();
    resolve();
  }

  const handleRowUpdate = (newData: RowData, oldData: RowData, resolve: Promise<any>) => {
    let bNewEarn=isEarn(newData.category_id);
    let bOldEarn=isEarn(oldData.category_id);
    let dateArray = newData.dateFormat.split("/");
    let newDate = moment(new Date(dateArray[2], dateArray[1]-1, dateArray[0])).format('YYYY-MM-DD');
    newDate = newDate.concat("T06:00:00.000Z");
    let updateJson = {id: newData.id,
      date: newDate,
      account: {
        name: account ? account.name: accounts[0].name,
        type: account ? account.type: accounts[0].type
      }};
    updateJson={...updateJson, category_id: (newData.category_id?newData.category_id: oldData.category_id)};
    updateJson={...updateJson, description: (newData.description?newData.description: oldData.description)};
    updateJson={...updateJson, value: (newData.value?newData.value: oldData.value)};

    let url;
    if(bNewEarn || bOldEarn){url = '/earn';}else {url = '/expense'; updateJson.value = -1*updateJson.value;}
    const update = apiClient.patch(url, updateJson);
    load();
    resolve();
  }

  async function load() {
    let categoryList = [];
    for (const item of earns) { categoryList[item.id]= item.name; }
    for (const item of expenses) { categoryList[item.id]= item.name ;}
    setCategories(categoryList);

    let lista = (await apiClient.post('/account/resume', returnJsonQuery(account, period))).data;
    let dados = lista.extrato;
    setAccountResumeList(dados);
    let array = returnTableColum(categoryList);
    setColumns(array);
    setRest({columns: array,
      data: dados,
      handleRowAdd: handleRowAdd,
      handleRowUpdate: handleRowUpdate,
      setData: setAccountResumeList,
      options:{
        pageSize:10
      }
    });
    setAccountTotal(returnResumeTotal(lista));

  }


  useMemo(()=>{
    let categoryList = [];
    for (const item of earns) { categoryList[item.id]= item.name; }
    for (const item of expenses) { categoryList[item.id]= item.name ;}
    setCategories(categoryList);
    let lista =undefined;
    if(accountResumeList===undefined ) lista = accountResume;
    else lista = accountResumeList;
    if(lista.extrato){
      //Tratamento dos dados
      let dados = lista.extrato;
      setColumns(returnTableColum(categoryList));

      setRest({columns: returnTableColum(categoryList),
        data: dados,
        handleRowAdd: handleRowAdd,
        handleRowUpdate: handleRowUpdate,
        setData: setAccountResumeList,
        options:{
          pageSize:10
        }
      });
      setAccountTotal(returnResumeTotal(lista));
    }
    
  }, []);

  useMemo(()=>{
    refresh();
  },[account, period]);

  const montaComboPeriodo = useMemo(()=>(<CompleteComboBox {...periodOption}/>), [periodOption]);
  const montaComboConta = useMemo(()=>(<CompleteComboBox {...accountOption}/>), [accountOption]);
  const montaTabelaExtrato = useMemo(()=>{
    return(<GenericTable rest={rest} selectedRow={selectExtrato} setSelectedRow={setSelectExtrato} />);
  }, [columns, selectExtrato, accountResumeList]);
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
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const responseCategory = await apiClient.get('/category');

  const responsePeriods = await apiClient.get('/period');
  const responseAccounts = await apiClient.get('/account');
  let retorno = {props:{}};
  if(responsePeriods.data) retorno.props = {...retorno.props, periods: responsePeriods.data.reverse()}
  if(responseAccounts.data) retorno.props = {...retorno.props, accounts: responseAccounts.data}

  //earns
  const earns = responseCategory.data.filter(item => !item.expense);
  const expenses = responseCategory.data.filter(item => item.expense);
  if(responseCategory.data) retorno.props = {...retorno.props, earns: earns}
  //expenses
  if(responseCategory.data) retorno.props = {...retorno.props, expenses: expenses}

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