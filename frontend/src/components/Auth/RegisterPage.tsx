import {
  Button,
  Form,
  Grid,
  Input,
  notification,
  theme,
  Typography,
} from "antd";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export const RegisterPage = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (event: any) => {
    event.preventDefault();

    const newUser = {
      name: name,
      phone: phone,
      email: email,
      password: password,
    };
    try {
      await AuthService.register(newUser, dispatch, navigate);
      notification.success({
        message: "Register Success",
        description: "Your request has been successfully completed!",
        duration: 2,
        style: { backgroundColor: "#eaffdd" },
      });
    } catch (error: any) {
      console.log("Register Error: ", error.response.data.message);
    }
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.paddingXL}px ${token.padding}px`,
      width: "380px",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center",
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={{}}>
          <Title style={styles.title}>Register</Title>
        </div>
        <Form
          name="normal_signup"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
          onSubmitCapture={handleRegister}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your Phone!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Sign up
            </Button>
            <div style={{}}>
              <Text style={styles.text}>Already have an account?</Text>{" "}
              <Link to="/login"> Sign in</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
