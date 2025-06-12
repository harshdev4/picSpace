import React from 'react'
import styles from './ProfileTabs.module.css';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";

const ProfileTabs = ({tab, setTab}) => {

  return (
    <div className={styles.tabs}>
            <div className={`${styles.tab} ${tab === 'Posts' && styles.active}`} onClick={()=> setTab('Posts')}><BsGrid3X3GapFill /></div>
            <div className={`${styles.tab} ${tab === 'Liked' && styles.active}`} onClick={()=> setTab('Liked')}><FaHeart/></div>
    </div>
  )
}

export default ProfileTabs
