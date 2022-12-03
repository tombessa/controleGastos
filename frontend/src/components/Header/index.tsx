import {useContext} from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import logoImg from '../../../public/MoneyBagIconBlank.svg';

import Image from 'next/image';
import {FiLogOut} from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext'; 

export function Header(){
    const {signOut} = useContext(AuthContext);
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <Image width={80} src={logoImg} alt="Logo" />
                </Link>
                
                <nav className={styles.menuNav}>
                    <Link href="/category">Categoria</Link>
                    <button onClick={signOut}>
                        <FiLogOut color="#FFF" size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}