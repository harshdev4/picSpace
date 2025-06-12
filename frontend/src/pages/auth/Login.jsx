import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance.js";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
    const passwordRef = useRef(null);
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    function togglePasswordView() {
        setIsEyeOpen((prev) => !prev);
    }

    const handleSubmit = async (formData) => {
        if (!formData.username.trim() || !formData.password.trim()) {
            toast.error("All field are required");
            throw new Error("Validation failed");
        }
        try {
            const res = await axiosInstance.post("/user/login", formData);
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Login failed");
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
            {mutation.isPending && (
                <div className={styles.loading}>
                    <div className={styles.loader}></div>
                </div>
            )}
            <div className={styles.content}>
                <img
                    src="logo-title.png"
                    alt="insta-logo"
                    className={styles.logoTitle}
                />
                <form
                    action=""
                    method="post"
                    className={styles.loginForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutation.mutate(formData);
                    }}
                >
                    <input
                        type="text"
                        name="username"
                        value={formData.username.trim()}
                        placeholder="Username"
                        autoFocus
                        onChange={handleInput}
                        required
                    />
                    <div className={styles.passwordBlock}>
                        <input
                            type={isEyeOpen ? "text" : "password"}
                            ref={passwordRef}
                            name="password"
                            id="password"
                            value={formData.password.trim()}
                            placeholder="Password"
                            onChange={handleInput}
                            className={styles.passwordInput}
                            required
                        />
                        {passwordRef.current &&
                            passwordRef.current.value.length > 0 &&
                            (!isEyeOpen ? (
                                <FaRegEyeSlash
                                    className={styles.eye}
                                    onClick={togglePasswordView}
                                />
                            ) : (
                                <FaRegEye className={styles.eye} onClick={togglePasswordView} />
                            ))}
                    </div>
                    <input type="submit" value="Log in" />
                </form>
            </div>
            <p id={styles.accountQuery}>
                Don't have an account?{" "}
                <Link to="/signup" id={styles.link}>
                    {" "}
                    Sign up{" "}
                </Link>
            </p>
        </>
    );
};

export default Login;
