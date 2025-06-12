import styles from './DeletePopUp.module.css';
import axiosInstance from '../../api/axiosInstance.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const DeletePopUp = ({postId, closeFn}) => {
    const queryClient = useQueryClient();

    const deletePost = async ({postId}) =>{
        try {
            const res = await axiosInstance.delete(`/post/deletePost/${postId}`);
            return res.data.message;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            closeFn();
            queryClient.invalidateQueries(['Posts']);
            toast.success(data);
        },
        onError: (error) => {
            closeFn();
            toast.error(error.message);
        },
        retry: false
    })
    return (
        <div className={styles.deleteMenuList}>
            <div className={styles.contextContainer}>
                <span className={styles.menuContext}>Delete post?</span>
                <span className={styles.menuAlert}>Are you sure you want to delete this post?</span>
            </div>
            <div className={styles.buttonContainer}>
                <span className={styles.menuButton} onClick={()=> mutation.mutate({postId})}>Delete</span>
                <span className={styles.menuButton} onClick={closeFn}>Cancel</span>
            </div>
        </div>
    )
}

export default DeletePopUp
