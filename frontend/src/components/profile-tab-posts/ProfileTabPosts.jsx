import React, { useRef } from 'react'
import styles from './ProfileTabPosts.module.css';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { GiEmptyHourglass } from 'react-icons/gi';

const ProfileTabPosts = ({ tab, posts }) => {
 
    const likeContainer = useRef();

    function showLike(e) {
        const parentNode = e.currentTarget;
        const likeTag = parentNode.querySelector('.likeContainer');
        likeTag.style.display = "flex";
    }

    function hideLike(e) {
        const parentNode = e.currentTarget;
        const likeTag = parentNode.querySelector('.likeContainer');
        likeTag.style.display = "none";
    }

    return (
        <div className={styles.postSection}>
            {posts.length > 0 ?
                posts.map((post, index) => (
                    <Link to={`/post/${post._id}`} key={index}>
                        <div className={styles.post} onMouseOver={showLike} onMouseLeave={hideLike}>
                            <img src={post.image} alt="postImage" className={styles.postImage} />
                            <div className={`${styles.likeContainer} likeContainer`} ref={likeContainer} ><FaHeart className={styles.like} /><span>{post.likes.length}</span> </div>
                        </div>
                    </Link>
                ))
                :
                <div className={styles.emptyContainer}>
                    <GiEmptyHourglass className={styles.emptyIcon} />
                    <span className={styles.emptyFeedText}>{tab === 'Posts' ? "No post yet": "Not liked any post yet"}</span>
                </div>
            }
        </div>
    )
}

export default ProfileTabPosts
