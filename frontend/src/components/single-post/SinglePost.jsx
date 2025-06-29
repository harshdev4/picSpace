import styles from './SinglePost.module.css';
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import PopUp from '../menu-popup/PopUp';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineUserCircle } from "react-icons/hi2";
import axiosInstance from '../../api/axiosInstance.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../loader/Loader.jsx';
import {Helmet} from 'react-helmet';

const SinglePost = () => {

    const { postId } = useParams();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [like, setLike] = useState(0);

    const [isPopUp, setIsPopUp] = useState(false);
    const [captionText, setCaptionText] = useState('');
    const caption = useRef();
    const queryClient = useQueryClient();
    const [isCaptionEdit, setIsCaptionEdit] = useState(false);
    const navigate = useNavigate();

    const currentUser = queryClient.getQueryData(['user']);

    const getPost = async (postId) => {
        try {
            const res = await axiosInstance.get(`/post/singlePost?postId=${postId}`);
            return res.data.post;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Something went wrong");
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['singlePost', postId],
        queryFn: () => getPost(postId),
        retry: false
    });

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
            if (!userId) {
                return;
            }
            await queryClient.cancelQueries({ queryKey: ['Posts'] });
            const previousPosts = queryClient.getQueryData(['Posts']);

            await queryClient.cancelQueries({ queryKey: ['singlePost', postId] });
            const previousSinglePost = queryClient.getQueryData(['singlePost', postId]);

            queryClient.setQueryData(['singlePost', postId], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    likes: oldData.likes.includes(userId) ? oldData.likes.filter(user => user !== userId) : [...oldData.likes, userId]
                }
            })
            
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

            return { previousPosts, previousSinglePost };
        },

        onError: (error, context) => {
            if (error.message === 'Unauthorized - No Token Provided') {
                navigate('/login');
            }
            toast.error(error.message);
            queryClient.setQueryData(['Posts'], context.prevPosts);
            queryClient.setQueryData(['singlePost', postId], context.previousSinglePost);
        }
    })

    const captionMutation = useMutation({
        mutationFn: saveCaption,
        onMutate: async ({ postId, userId, updatedCaption }) => {
            await queryClient.cancelQueries({ queryKey: ['Posts'] });
            const previousPosts = queryClient.getQueryData(['Posts']);

            await queryClient.cancelQueries({ queryKey: ['singlePost', postId] });
            const previousSinglePost = queryClient.getQueryData(['singlePost', postId]);

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

            queryClient.setQueryData(['singlePost', postId], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    caption: updatedCaption
                }
            })

            setIsCaptionEdit(false);
            return { previousSinglePost, previousPosts };
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error, context) => {
            queryClient.setQueryData(['Posts'], context.previousPosts);
            queryClient.setQueryData(['singlePost', postId], context.previousSinglePost);
            toast.error(error.message);
        }
    })

    useEffect(() => {
        if (data) {
            setUser(data.user);
            setImage(data.image);
            setIsLiked(data.likes.includes(currentUser?.id));
            setLike(data.likes.length);
            setCaptionText(data.caption);
        }
    }, [data]);

    return (
        <div className={styles.postContainer}>
            <Helmet>
                <title>{captionText} | PicSpace</title>
            </Helmet>
            <div className={styles.post}>
                {isLoading ? <Loader /> : isError ? <h1 className={styles.error}>{error.message}</h1> :
                    <>
                        {isPopUp && <PopUp togglePopUp={togglePopUp} postId={postId} setIsPopUp={setIsPopUp} setIsCaptionEdit={setIsCaptionEdit} caption={caption}></PopUp>}
                        {currentUser && user?._id === currentUser.id && <BsThreeDots className={styles.menuDots} onClick={togglePopUp} />}
                        <div className={styles.postTopContainer}>
                            {user?.profilePic ?
                                <img src={user.profilePic} alt="profile" className={styles.profileImage} /> :
                                <HiOutlineUserCircle className={`${styles.profileImage} ${styles.profileIcon}`} />
                            }
                            <div className={styles.nameContainer}>
                                <h3 className={styles.username}>{user?.username}</h3>
                                <h4 className={styles.fullname}>{user?.fullname}</h4>
                            </div>
                        </div>
                        <img src={image} alt="postImage" className={styles.postImage} />
                        <div className={styles.postBottomContainer}>
                            <div className={styles.likeContainer}>{isLiked ? <FaHeart className={`${styles.likeIcon} ${isLiked && styles.likeColor}`} onClick={() => mutation.mutate({ postId, userId: currentUser?.id })} /> : <FaRegHeart className={styles.likeIcon} onClick={() => mutation.mutate({ postId, userId: currentUser?.id })} />} <span className={styles.likeCount}>{like} likes</span></div>
                            <textarea ref={caption} rows={1} className={`${styles.captionContainer} ${isCaptionEdit && styles.captionEditingBox}`} value={captionText} readOnly={isCaptionEdit ? false : true} onChange={(e) => setCaptionText(e.target.value)}></textarea>
                            {isCaptionEdit && <button className={styles.saveCaptionBtn} onClick={() => captionMutation.mutate({ postId, userId: currentUser?.id, updatedCaption: captionText })}>Save</button>}
                        </div>
                    </>
                }
            </div>
        </div>

    )
}

export default SinglePost
