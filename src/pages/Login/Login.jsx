import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "animate.css"
import graphicsImage from '../../assets/log_slices/_graphics.webp'

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    const handleSwitch = (toLogin) => {
        setIsExiting(true);
        setTimeout(() => {
            setIsLogin(toLogin);
            setIsExiting(false);
        }, 300);
    };

    return (
        <div className="bg-custom-gray w-screen h-screen flex items-center justify-center gap-20">
            <div className="w-96">
                {isLogin ? (
                    <div className={`animate__animated ${isExiting ? 'animate__fadeOutRight' : 'animate__fadeInLeft'}`}>
                        <LoginForm onSwitchToRegister={() => handleSwitch(false)} />
                    </div>
                ) : (
                    <div className={`animate__animated ${isExiting ? 'animate__fadeOutRight' : 'animate__fadeInLeft'}`}>
                        <RegisterForm onSwitchToLogin={() => handleSwitch(true)} />
                    </div>
                )}
            </div>
            <div className="">
                <img src={graphicsImage} alt="" />
            </div>
        </div>
    )
}