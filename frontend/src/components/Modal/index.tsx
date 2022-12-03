import Modal from 'react-modal';
import styles from './styles.module.scss';

import { FiX } from 'react-icons/fi'

interface ModalOrderProps{
  isOpen: boolean;
  onRequestClose: () => void;
}

export function ModalDash({ isOpen, onRequestClose }: ModalOrderProps){

  const customStyles = {
    content:{
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e'
    }
  };
  

  return(
   <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
   >

    <button
    type="button"
    onClick={onRequestClose}
    className="react-modal-close"
    style={{ background: 'transparent', border:0 }}
    >
      <FiX size={45} color="#f34748" />
    </button>

    <div className={styles.container}>


    </div>

   </Modal>
  )
}