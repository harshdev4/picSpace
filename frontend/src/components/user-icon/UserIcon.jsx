import React from 'react'
import styles from './UserIcon.module.css';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";

const UserIcon = ({ image, username, fullname }) => {
    return (
        <Link to={`/profile/${username}`} className={styles.userIconContainer}>
            <div className={styles.imageContainer}>
                {image ?
                    <img src={image} alt="profile" className={styles.userImage} /> :
                    <FaUser className={`${styles.userImage} ${styles.profileIcon}`} />
                }
            </div>
            <span className={styles.fullname}>{fullname}</span>
        </Link>
    )
}

export default UserIcon
