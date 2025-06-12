import styles from './Post.module.css';
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import PopUp from '../menu-popup/PopUp';
import { useRef, useState } from 'react';
import { HiOutlineUserCircle } from "react-icons/hi2";
import axiosInstance from '../../api/axiosInstance.js';
import {Link} from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Post = ({ postId, user, caption: captionProp, owner, image, isLiked, like }) => {
    const [isPopUp, setIsPopUp] = useState(false);
    const [captionText, setCaptionText] = useState(captionProp);
    const caption = useRef();
    const queryClient = useQueryClient();
    const [isCaptionEdit, setIsCaptionEdit] = useState(false);

    const currentUser = queryClient.getQueryData(['user']);
    
    const togglePopUp = () => {
        document.body.classList.toggle('overflow-hidden');
        setIsPopUp((prev) => !prev);
    }

    const handleLikeClick = async ({ postId, userId }) => {
        try {
            const res = await axiosInstance.patch(`/post/like?postId=${postId}`);
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const saveCaption = async ({ postId, userId, updatedCaption }) => {
        try {
            const res = await axiosInstance.patch(`/post/updateCaption?postId=${postId}&userId=${userId}`, { caption: updatedCaption });
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const mutation = useMutation({
        mutationFn: handleLikeClick,
        onMutate: async ({ postId, userId }) => {
            await queryClient.cancelQueries({ queryKey: ['Posts'] });
            const previousPosts = queryClient.getQueryData(['Posts']);

            queryClient.setQueryData(['Posts'], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        posts: page.posts.map(post => post._id === postId ? {
                            ...post,
                            likes: post.likes.includes(userId) ? post.likes.filter(user => user !== userId) : [...post.likes, userId]
                        } : post)
                    })
                    )
                }
            })
            return { previousPosts };
        },

        onError: (error, context) => {
            toast.error(error.message);
            queryClient.setQueryData(['Posts'], context.prevPosts);
        }
    })

    const captionMutation = useMutation({
        mutationFn: saveCaption,
        onMutate: async ({ postId, userId, updatedCaption }) => {
            await queryClient.cancelQueries({ queryKey: ['Posts'] });
            const previousPosts = queryClient.getQueryData(['Posts']);

            queryClient.setQueryData(['Posts'], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        posts: page.posts.map(post => post._id === postId ? {
                            ...post,
                            caption: updatedCaption
                        } : post)
                    })
                    )
                }
            })
            setIsCaptionEdit(false);
            return { previousPosts };
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error, context) => {
            queryClient.setQueryData(['Posts'], context.previousPosts);
            toast.error(error.message);
        }
    })

    return (
        <div className={styles.post}>
            {isPopUp && <PopUp togglePopUp={togglePopUp} postId={postId} setIsPopUp={setIsPopUp} setIsCaptionEdit={setIsCaptionEdit} caption={caption}></PopUp>}
            {owner._id === currentUser.id && <BsThreeDots className={styles.menuDots} onClick={togglePopUp} />}
            <Link to={`/profile/${user.username}`} className={styles.navigateLink}><div className={styles.postTopContainer}>
                {user.profilePic ?
                    <img src={user.profilePic} alt="profile" className={styles.profileImage} /> :
                    <HiOutlineUserCircle className={`${styles.profileImage} ${styles.profileIcon}`} />
                }
                <div className={styles.nameContainer}>
                    <h3 className={styles.username}>{user.username}</h3>
                    <h4 className={styles.fullname}>{user.fullname}</h4>
                </div>
            </div></Link>
            <img src={image} alt="postImage" className={styles.postImage} />
            <div className={styles.postBottomContainer}>
                <div className={styles.likeContainer}>{isLiked ? <FaHeart className={`${styles.likeIcon} ${isLiked && styles.likeColor}`} onClick={() => mutation.mutate({ postId, userId: currentUser.id })}/> : <FaRegHeart className={styles.likeIcon} onClick={() => mutation.mutate({ postId, userId: currentUser.id })} />} <span className={styles.likeCount}>{like} likes</span></div>
                <textarea ref={caption} rows={1} className={`${styles.captionContainer} ${isCaptionEdit && styles.captionEditingBox}`} value={captionText} readOnly={isCaptionEdit ? false : true} onChange={(e) => setCaptionText(e.target.value)}></textarea>
                {isCaptionEdit && <button className={styles.saveCaptionBtn} onClick={() => captionMutation.mutate({ postId, userId: currentUser.id, updatedCaption: captionText })}>Save</button>}
            </div>
        </div>
    )
}

export default Post
