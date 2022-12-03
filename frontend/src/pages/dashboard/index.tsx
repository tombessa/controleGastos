import {canSSRAuth} from "../../utils/canSSRAuth";
import Head from 'next/head';
import{useState} from 'react';
import {Header} from '../../components/Header';
import styles from './styles.module.scss'
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import Modal from 'react-modal';
import {ModalDash} from '../../components/Modal';

import { toast } from "react-toastify";

export default function Dashboard(){
  const [modaVisible, setModalVisible] = useState(false);


  async function handleOpenModalView(){
    setModalVisible(true);
  }


  function handleCloseModal(){
    setModalVisible(false);
  }

  Modal.setAppElement('#__next'); //Verificado no código do next (id)
  return(
    <>
      <Head>
        <title>Painel - Controle de Gastos</title>
      </Head>
      <div>
        <Header/>
        <main className={styles.container}>
          <div  className={styles.containerHeader}>
            </div>
          <article className={styles.listOrders}>
            <section className={styles.orderItem} >
              <button onClick={() => handleOpenModalView()}>
                <div className={styles.tag}></div>
                <span></span>
              </button>
            </section>
            
          </article>
        </main>
        {modaVisible && (<ModalDash isOpen={modaVisible} onRequestClose={handleCloseModal} />)}
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/earn');
  
  return {
      props: {
        orders: response.data
      }
  }
})