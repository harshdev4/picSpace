import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import styles from "./Profile.module.css";
import Post from "../../components/post/Post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader.jsx";
import { FaUserCircle } from "react-icons/fa";
import ProfileTabs from "../../components/profile-tabs/ProfileTabs.jsx";
import ProfileTabPosts from "../../components/profile-tab-posts/ProfileTabPosts.jsx";
import { Helmet } from "react-helmet";
import { useFollowMutation } from "../../hooks/useFollowMutation.jsx";


const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loggedInUser = queryClient.getQueryData(['user']);

  const { username } = useParams("username");

  const [tab, setTab] = useState("Posts");


  const fetchUser = async (username) => {
    try {
      const res = await axiosInstance.get(`/user/getProfile/${username}`);
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/user/logout");
      return res.data;

    } catch (error) {
      throw new Error(error.response?.data?.error || "Something went wrong");
    }
  };

  const getUser = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUser(username),
    retry: false,
  })

  const user = getUser.data;

  const logoutMutation = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      toast.success("Logged out");
      queryClient.removeQueries({ queryKey: ['user'], exact: true });
      queryClient.removeQueries({ queryKey: ['StoryUsers'], exact: true });
      queryClient.removeQueries({ queryKey: ['Posts'], exact: true });
      queryClient.removeQueries({
        predicate: query =>
          query.queryKey[0] === 'profile'
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });


const {mutate: follow} = useFollowMutation(username, getUser.data?._id)

  return (
    <div className={styles.profileContainer}>
      <Helmet>
        <title>{`${getUser.data?.username} | PicSpace`}</title>
      </Helmet>
      {getUser.isLoading && (
        <Loader />
      )}
      {user && (
        <>
          <div className={`${styles.profile}`}>
            <div className={styles.profileInfo}>
              <div className={styles.pic}>
                {user.profilePic ? <img src={user.profilePic} alt="profilePic" className={styles.profilePic} /> :
                  <FaUserCircle className={`${styles.profilePic} ${styles.profileIcon}`} />
                }
              </div> 

              <div className={styles.infoSectionContainer}>
                <div className={styles.infoSection}>
                  <h2 className={styles.profileUsername}>{user.username}</h2>
                  {loggedInUser?.username === user.username ? (
                    <div className={styles.btnContainer}>
                      <Link to="/profile/edit" className={styles.profileSectionBtn} id={styles.editBtn}>Edit Profile</Link>
                      <button className={styles.profileSectionBtn} id={styles.logoutBtn} onClick={() => logoutMutation.mutate()}>Logout</button>
                    </div>
                  ) : (
                    <button className={styles.profileSectionBtn} onClick={() => follow()}>{loggedInUser?.following.includes(getUser.data?._id) ? "Following" : "Follow"}</button>
                  )}
                </div>

                <div className={`${styles.infoSection} ${styles.statsSection}`}>
                  <h2 className={styles.postCount}>{user?.post.length} <span className={styles.followPostSpan}> post </span></h2>
                  <Link to={`/${user.username}/followers`} className={styles.link}><h2 className={styles.followerCount}>{getUser.data?.followers.length || 0}{" "} <span className={styles.followPostSpan}> followers </span></h2></Link>
                  <Link to={`/${user.username}/following`} className={styles.link}><h2 className={styles.followingCount}>{getUser.data?.following.length || 0}{" "} <span className={styles.followPostSpan}> following </span></h2></Link>
                </div>

                <div className={`${styles.infoSection} ${styles.fullnameSection}`}>
                  <p className={styles.profileFullname}>{user.fullname}</p>
                </div>

                <div className={`${styles.infoSection} ${styles.fullnameSection}`}>
                  <p className={styles.profileBio}>{user.profileBio}</p>
                </div>
              </div>
            </div>

            <h2 className={`${styles.profileFullname} ${styles.underImageFullname}`}>{user.fullname}</h2>
            <p className={`${styles.profileBio} ${styles.underImageFullname}`}>{user.profileBio}</p>
          </div>

          <div className={`${styles.infoSection} ${styles.statsSectionSM}`} >
            <h2 className={styles.postCount}>
              {user.post.length}
              <span className={styles.followPostSpan}> post </span>
            </h2>
            <Link to={`/${user.username}/followers`} className={styles.link}><h2 className={styles.followerCount}>
              {getUser.data?.followers.length || 0}{" "}
              <span className={styles.followPostSpan}> followers </span>
            </h2></Link>
            <Link to={`/${user.username}/following`} className={styles.link}><h2 className={styles.followingCount}>
              {getUser.data?.following.length || 0}{" "}
              <span className={styles.followPostSpan}> following </span>
            </h2></Link>
          </div>
          <ProfileTabs tab={tab} setTab={setTab} />
          <ProfileTabPosts tab={tab} posts={tab === 'Posts' ? user.post : user.likedPost} />
        </>
      )}
    </div>
  );
};

export default Profile;
