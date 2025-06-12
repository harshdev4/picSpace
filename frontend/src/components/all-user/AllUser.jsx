import React from 'react'
import styles from './AllUser.module.css';
import axiosInstance from '../../api/axiosInstance.js';
import { useQuery } from '@tanstack/react-query';
import UserIcon from '../user-icon/UserIcon.jsx';
const AllUser = () => {
    
    const getUsers = async () => {
        try {
            const res = await axiosInstance.get('/user/getUsers');
            return res.data.users;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['AllUsers'],
        queryFn: getUsers,
        staleTime: 3 * 60 * 1000,
        retry: false,
    });
    
    return (
        <>
            {data && data.length > 0 &&
                <div className={styles.userContainer}>
                    {
                        data.map(user => <UserIcon key={user._id} image={user.profilePic} username={user.username} fullname={user.fullname} />)
                    }
                </div>
            }
        </>
    )
}

export default AllUser
