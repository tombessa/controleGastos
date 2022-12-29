
import Head from 'next/head';
import styles from './styles.module.scss'
import {Header} from '../../components/Header';

export default function Category(){
    return (<>
        <Head>
          <title>Categoria</title>
        </Head>
        <div>
          
          <Header/>
          <main className={styles.container}>
            
          </main>
          
        </div>
      </>
    );
}