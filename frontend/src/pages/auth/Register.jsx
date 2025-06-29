import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import axiosInstance from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from '../../components/loader/Loader';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const Register = () => {
    const passwordRef = useRef(null);
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        fullname: "",
        username: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const handleInput = (e) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (e.target.name === "fullname" && regex.test(e.target.value)) {
            setFormData({
                ...formData,
                ["fullname"]: e.target.value,
            });
        } else if (e.target.name !== "fullname") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    function togglePasswordView() {
        setIsEyeOpen(prev => !prev)
    }


    const handleSubmit = async (formData) => {
        if (!formData.email.trim() || !formData.fullname.trim() || !formData.username.trim() || !formData.password.trim()) {
            toast.error("All field are required");
            throw new Error("Validation failed");
        }
        try {
            const res = await axiosInstance.post("/user/register", formData);
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Signup failed");
        }
    };

    const mutation = useMutation({
        mutationFn: handleSubmit,
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            navigate('/');
        },
        onError: (error) => {
            toast.error(error.message);
        },
        retry: false,
    });

    return (
        <>
            <Helmet>
                <title>Sign-up | PicSpace</title>
            </Helmet>
            {mutation.isPending && (
                <Loader />
            )}
            <div className={styles.content}>
                <img
                    src="logo-title.png"
                    alt="insta-logo"
                    className={styles.logoTitle}
                />
                <p id={styles.signupMsg}>
                    Sign up to see photos and videos from your friends.
                </p>
                <form
                    action=""
                    method="post"
                    className={styles.signupForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("clicked");
                        mutation.mutate(formData);
                    }}
                >
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleInput}
                        autoFocus
                        required
                    />
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname.trimStart()}
                        placeholder="Full Name"
                        onChange={handleInput}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={formData.username.trim()}
                        placeholder="Username"
                        onChange={handleInput}
                        required
                    />
                    <div className={styles.passwordBlock}>
                        <input
                            type={isEyeOpen ? 'text' : 'password'}
                            ref={passwordRef}
                            name="password"
                            id="password"
                            value={formData.password.trim()}
                            placeholder="Password"
                            className={styles.passwordInput}
                            onChange={handleInput}
                            required
                        />
                        {passwordRef.current && passwordRef.current.value.length > 0 && (
                            !isEyeOpen ? <FaRegEyeSlash className={styles.eye} onClick={togglePasswordView} /> : <FaRegEye className={styles.eye} onClick={togglePasswordView} />
                        )}
                    </div>
                    <input type="submit" value="Sign up" />
                </form>
            </div>
            <p id={styles.accountQuery}>
                Have an account?{" "}
                <Link to="/login" id={styles.link}>
                    Log in
                </Link>
            </p>
        </>
    );
};

export default Register;
