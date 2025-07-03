import React from 'react'
import styles from './FollowUsers.module.css';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';

const FollowUsers = ({ users, follow, username }) => {
  const queryClient = useQueryClient();
  const loggedInUser = queryClient.getQueryData(['user']);
  return (
    <div className={styles.userContainer} style={{boxShadow: users?.length === 0 && 'unset'}}>
      {
        users?.length > 0 ? users?.map(user => (
          <div key={user._id} className={styles.userBox}>
            <Link to={`/profile/${user.username}`} className={styles.profileLink}>
              <div className={styles.userBoxLeft}>
                {user.profilePic ?
                  <img src={user.profilePic} alt="user-profile" className={styles.userProfile} /> :
                  <FaUser className={`${styles.userProfile} ${styles.profileIcon}`} />
                }
                <div className={styles.names}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.fullname}>{user.fullname}</span>
                </div>
              </div >
            </Link>
            {/* {username === loggedInUser.username && (follow === "following" ? <button className={styles.btn}>Remove</button> : <button className={styles.btn}>Unfollow</button>)} */}
          </div>
        )) :
        <h3 className={styles.emptyList}>No users found</h3>
      }
    </div>
  )
}

export default FollowUsers
