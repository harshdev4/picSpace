import { useState } from 'react';
import DeletePopUp from './DeletePopUp';
import styles from './PopUp.module.css';
import toast from 'react-hot-toast';

const PopUp = ({ togglePopUp, setIsPopUp, postId, setIsCaptionEdit, caption }) => {
    const [isDeletePopUp, setIsDeletePopUp] = useState(false);

    const openEditBox = () => {
        togglePopUp();
        setIsCaptionEdit(true);
        caption.current.focus();
    }

    const toggleDeleteAlert = () => {
        if (isDeletePopUp) {
            setIsPopUp(false);
            document.body.classList.toggle('overflow-hidden');
        }
        setIsDeletePopUp((prev) => !prev);
    }
    const handleClose = (e) => {
        const id = e.target.getAttribute("id");
        if (id == "menuContainer") {
            togglePopUp();
        }
    }

    const handleCopy = (postId) => {
        const text = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(text)
            .then(() => toast.success("Copied to clipboard!"))
            .catch((err) => toast.error("Failed to copy: " + err))
            .finally(togglePopUp());
    };

    return (
        <div className={styles.menuContainer} id='menuContainer' onClick={handleClose}>
            {!isDeletePopUp && <div className={styles.menuList}>
                <span className={styles.menuButton} onClick={openEditBox}>Edit caption</span>
                <span className={styles.menuButton} onClick={()=>handleCopy(postId)}>Copy url</span>
                <span className={styles.menuButton} onClick={toggleDeleteAlert}>Delete post</span>
            </div>}
            {isDeletePopUp && <DeletePopUp postId={postId} closeFn={toggleDeleteAlert}></DeletePopUp>}
        </div>
    )
}

export default PopUp
