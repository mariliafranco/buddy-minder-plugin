import React, { useState } from "react";
import { Button, Input, Typography, Divider } from "antd";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../firebase";
import { useTranslation } from "react-i18next";
import { GoogleOutlined } from "@ant-design/icons";
import LoggedIn from "../LoggedIn/LoggedIn";
import "./Login.scss";

const Login = ({ onLoginSuccess, currentUser }) => {
  const { t } = useTranslation();
  const { Title } = Typography;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(currentUser);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      onLoginSuccess(userCredential.user);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      onLoginSuccess(userCredential.user);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(t("passwordResetEmailSent"));
    } catch (error) {
      console.error("Password Reset Error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      setUser(userCredential.user);
      onLoginSuccess(userCredential.user);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  if (user) {
    return <LoggedIn user={user} />;
  }

  return (
    <div className="login-container">
      {isRegistering ? (
        <Title level={2}>{t("register")}</Title>
      ) : (
        <Title level={2}>{t("login")}</Title>
      )}

      <div className="login-input-email">
        <label>{t("email")}</label>
        <Input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder={t("email")}
          required
        />
      </div>
      <div className="login-input-password">
        <label>{t("password")}</label>
        <Input.Password
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {isRegistering && (
        <div className="login-input-password">
          <label>{t("confirmPassword")}</label>
          <Input.Password placeholder={t("confirmPassword")} required />
        </div>
      )}
      <div className="login-form-buttons-container">
        {isRegistering ? (
          <Button
            className="primary-confirmation-button"
            type="primary"
            onClick={handleRegister}
          >
            {t("register")}
          </Button>
        ) : (
          <Button
            className="primary-confirmation-button"
            type="primary"
            onClick={handleLogin}
          >
            {t("login")}
          </Button>
        )}
        <Button
          className="secondary-button"
          type="link"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? t("alreadyHaveAccount") : t("dontHaveAccount")}
        </Button>
      </div>
      {!isRegistering && (
        <>
          {/* <Divider /> */}
          <Button
            className="secondary-button google-button"
            type="default"
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
          >
            {t("loginWithGoogle")}
          </Button>
        </>
      )}
    </div>
  );
};

export default Login;
