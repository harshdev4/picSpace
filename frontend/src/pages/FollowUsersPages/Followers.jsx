import React, { useState } from 'react'
import FollowUsers from '../../components/follow-users/FollowUsers'
import { useParams } from 'react-router-dom'
import styles from './FollowUsers.module.css'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../components/loader/Loader'
import axiosInstance from '../../api/axiosInstance'

const Followers = () => {
    const { username } = useParams();
    const [searchQuery, setSearchQuery] = useState("");

    const getFollowers = async () => {
        try {
            const res = await axiosInstance.get(`/user/${username}/followers/`);
            return res.data.users.reverse();
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: [username, 'followers'],
        queryFn: getFollowers,
        retry: false
    })

    const filteredUsers = users?.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.userContainer}>
            {isLoading && <Loader />}
            {
                isError ? <h1 className={styles.error}>{error.message}</h1> :
                    <>
                        <div className={styles.inputContainer}>
                            <span className={`material-symbols-rounded ${styles.searchIcon}`}>search</span>
                            <input type="text" name="search" value={searchQuery} className={styles.searchBar} placeholder='Search' autoComplete="off" onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <FollowUsers users={filteredUsers} follow="followers" username={username}/>
                    </>
            }
        </div>
    )
}

export default Followers
