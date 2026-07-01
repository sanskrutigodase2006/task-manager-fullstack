import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile,
    changePassword
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });

    const [passwordData, setPasswordData] =
        useState({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            loadProfile();
        }
    }, [navigate]);

    const loadProfile = async () => {
        try {
            const email = localStorage.getItem("email");

            if (!email) {
                navigate("/login");
                return;
            }

            const response = await getProfile(email);
            setProfile(response.data);

        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdateProfile =
        async (e) => {
            e.preventDefault();

            try {
                await updateProfile(profile);

                localStorage.setItem(
                    "name",
                    profile.name
                );

                alert(
                    "Profile Updated Successfully"
                );
            } catch (error) {
                console.log(error);
            }
        };

    const handleChangePassword =
        async (e) => {
            e.preventDefault();

            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {
                alert("Passwords do not match");
                return;
            }

            try {
                await changePassword({
                    email: profile.email,
                    oldPassword:
                        passwordData.oldPassword,
                    newPassword:
                        passwordData.newPassword
                });

                alert(
                    "Password Changed Successfully"
                );

                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } catch (error) {
                alert("Old Password Incorrect");
            }
        };

    return (
        <div className="auth-container">
            <div
                className="auth-card"
                style={{ width: "600px" }}
            >
                <div className="auth-header">

                    <div className="auth-logo">
                        {profile.name
                            ? profile.name.charAt(0).toUpperCase()
                            : "👤"}
                    </div>

                    <h1>My Profile</h1>

                    <p>
                        Manage your account details
                    </p>

                </div>

                <h2>Edit Profile</h2>

                <form
                    onSubmit={handleUpdateProfile}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={profile.name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                name: e.target.value
                            })
                        }
                    />

                    <input
                        type="email"
                        value={profile.email}
                        disabled
                    />

                    <button
                        className="auth-btn"
                        type="submit"
                    >
                        Update Profile
                    </button>
                </form>

                <hr
                    style={{
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}
                />

                <h2>Change Password</h2>

                <form
                    onSubmit={handleChangePassword}
                >
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={
                            passwordData.oldPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                oldPassword:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={
                            passwordData.newPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                newPassword:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={
                            passwordData.confirmPassword
                        }
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                confirmPassword:
                                    e.target.value
                            })
                        }
                    />

                    <button
                        className="auth-btn"
                        type="submit"
                    >
                        Change Password
                    </button>
                </form>

                <button
                    className="auth-btn"
                    style={{
                        marginTop: "20px",
                        background: "#dc3545"
                    }}
                    onClick={() =>
                        navigate("/tasks")
                    }
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Profile;