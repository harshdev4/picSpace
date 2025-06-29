import React, { useRef, useState } from "react";
import styles from "./EditProfile.module.css";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Loader from '../../components/loader/Loader';
import { Helmet } from "react-helmet";

const EditProfile = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);

  const profileRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user?.profilePic || null);
  const [textData, setTextData] = useState({
    fullname: user?.fullname || "",
    bio: user?.bio || ""
  })

  const handleImageChange = () => {
    if (profileRef.current) {
      const file = profileRef.current.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
        imageMutation.mutate(file);
      }

    }
  }

  const saveImage = async (image) => {
    const formData = new FormData();
    formData.append('profilePic', image);
    try {
      const res = await axiosInstance.patch('/user/saveProfileImage', formData);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }

  const handleTextData = (e) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (e.target.name === "fullname" && regex.test(e.target.value)) {
      setTextData({
        ...textData,
        ["fullname"]: e.target.value,
      });
    } else if (e.target.name !== "fullname") {
      setTextData({
        ...textData,
        [e.target.name]: e.target.value,
      });
    }
    console.log(textData);
    
  }

  const updateProfile = async (textData) => {
    if (!textData.fullname.trim()) {
      throw new Error('Name cannot be empty');
    }

    try {
      const res = await axiosInstance.patch('/user/saveProfileData', textData);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }

  const imageMutation = useMutation({
    mutationFn: saveImage,
    onSuccess: (data) => {
      toast.success("Profile image changed");
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      setPreviewImage(undefined);
      toast.error(error.message);
    }
  })

  const dataMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      textData.fullname = user?.fullname || "",
      textData.bio = user?.bio || ""
      toast.error(error.message);
    }
  })

  return (
    <div className={styles.editContainer}>
      <Helmet>
        <title>Edit Profile - {user.username} | BeSocial</title>
      </Helmet>
      {imageMutation.isPending && <Loader />}
      <h1 className={styles.heading}>Edit Profile</h1>
      <div className={styles.editBox}>

        <div className={styles.imageUpdateSection}>
          {
            previewImage ? <img src={previewImage} alt="profile-pic" className={styles.profileImage} onClick={() => profileRef.current.click()} /> :
              <FaUserCircle className={`${styles.profileImage} ${styles.profileIcon}`} onClick={() => profileRef.current.click()} />
          }
          <input ref={profileRef} type="file" name="profilePic" id={styles.profilePic} accept="image/*" required hidden onChange={handleImageChange} />
          <button className={styles.submitBtn} onClick={() => profileRef.current.click()}> Change Image</button>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.textUpdateSection}>
          <label htmlFor="fullname">Full Name</label>
          <input type="text" name="fullname" id="fullname" value={textData.fullname} placeholder="Full Name" className={styles.input} onChange={handleTextData} />
          <label htmlFor="bio">Bio</label>
          <input type="text" name="bio" id="bio" value={textData.bio} placeholder="Bio..." className={styles.input} onChange={handleTextData} />
          <button className={styles.submitBtn} onClick={() => dataMutation.mutate(textData)}>Update</button>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
