import { useRef, useState } from 'react';
import styles from './Create.module.css';
import { CiImageOn } from "react-icons/ci";
import axiosInstance from '../../api/axiosInstance.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Loader from '../../components/loader/Loader.jsx';

const Create = () => {
  const inputFileRef = useRef();
  const previewImageRef = useRef();
  const [previewImage, setPreviewImage] = useState(undefined);
  const [insideDrop, setInsideDrop] = useState(false);
  const dragCounter = useRef(0);
  const captionRef = useRef("");
  const [fileInput, setFileInput] = useState(null);
  const queryClient = useQueryClient();

  const handleFileInput = () => {
    const file = inputFileRef.current.files[0];
    if (file) {
      setFileInput(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setInsideDrop(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setInsideDrop(false);
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileInput(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setInsideDrop(false);
    }
  }

  const handlePost = async ({file, caption}) =>{
    if (!file) {
      throw new Error("Image is required");
    }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption || '');
    try {
      const res = await axiosInstance.post('/post/create', formData);
      return res.data;
    } catch (error) {
      console.log("sfsfs");
      
      throw new Error(error.response?.data?.error || "Something went wrong");
    }
  }

  const mutation = useMutation({
    mutationFn: handlePost,
    onSuccess: () =>{
      toast.success('Post uploaded');
      setPreviewImage(undefined);
      captionRef.current.value = '';
      setFileInput(null);
      queryClient.invalidateQueries(["Posts"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: false,
  })

  return (
    <div className={styles.createContainer}>
      {mutation.isPending && <Loader/>}
      <div className={styles.createBox}>
        <input ref={inputFileRef} type="file" accept='image/*' onChange={handleFileInput} hidden required/>
        <div className={`${styles.dragBox} ${insideDrop && styles.highlight}`} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => {
          if (inputFileRef.current) inputFileRef.current.click();
        }}>
          {!previewImage ? <div className={styles.dropBoxTexContainer}>
            <CiImageOn className={styles.imageIcon} />
            <span className={styles.dragText}>Click to upload an image</span>
            <span className={`${styles.dragText} ${styles.mdDragText}`}>or drag and drop</span>
            <span className={`${styles.dragText} ${styles.smDragText}`}>JPG, PNG, WEBP up to 10MB</span></div> :
            <img ref={previewImageRef} src={previewImage} alt="upload" className={styles.previewImage} onLoad={() => URL.revokeObjectURL(previewImage)} />
          }
        </div>
        <div className={styles.leftOrBottomContainer}>
          <div className={styles.captionContainer}>
            <span className={styles.captionTitle}>Caption</span>
            <textarea ref={captionRef} className={styles.captionInput} placeholder='Caption' rows="1"></textarea>
          </div>
          <button className={styles.postBtn} onClick={()=> mutation.mutate({ file: fileInput, caption: captionRef.current.value })}>Post</button>
        </div>
      </div>
    </div>
  )
}

export default Create
