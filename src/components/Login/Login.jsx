import React, { useState } from "react";
import { Button, Input, Form, Typography, Divider } from "antd";
import { useTranslation } from "react-i18next";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../firebase";
import LoggedIn from "../LoggedIn/LoggedIn";

const Login = ({ onLoginSuccess, currentUser }) => {
  const { t } = useTranslation();
  const { Title } = Typography;
  const [form] = Form.useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(currentUser);
  console.log(user);

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

  const onFinish = (values) => {
    console.log("Received input values ", values);
  };

  if (user) {
    return <LoggedIn user={user} />;
  }

  return (
    <div>
      {isRegistering ? (
        <Title level={2}>{t("register")}</Title>
      ) : (
        <Title level={2}>{t("login")}</Title>
      )}

      <Form form={form} name="login" onFinish={onFinish}>
        <Form.Item
          name="email"
          label={t("email")}
          rules={[
            {
              type: "email",
              message: t("invalidEmail"),
            },
            {
              required: true,
              message: t("emailRequired"),
            },
          ]}
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder={t("email")}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("password")}
          rules={[
            {
              required: true,
              message: t("passwordRequired"),
            },
          ]}
        >
          <Input.Password
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        {isRegistering && (
          <Form.Item
            name="confirm"
            label={t("confirmPassword")}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("confirmPasswordRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwordMismatch")));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item className="login-form-buttons-container">
          {isRegistering ? (
            <Button
              className="primary-confirmation-button"
              type="primary"
              htmlType="submit"
              onClick={handleRegister}
            >
              {t("register")}
            </Button>
          ) : (
            <Button
              className="primary-confirmation-button"
              type="primary"
              htmlType="submit"
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
        </Form.Item>
        {!isRegistering && (
          <>
            {/* <Button
              className="secondary-button"
              type="link"
              onClick={handlePasswordReset}
            >
              {t("forgotPassword")}
            </Button> */}
            <Divider />
            <Button
              className="secondary-button"
              type="link"
              onClick={handleGoogleLogin}
            >
              {t("loginWithGoogle")}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default Login;
