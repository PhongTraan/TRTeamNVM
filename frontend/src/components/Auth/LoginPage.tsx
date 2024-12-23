import { Button, Checkbox, Form, Input, notification, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthService from "../../services/authService";

const { Text, Title } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event: any) => {
    event.preventDefault();

    const userLogin = {
      email: email,
      password: password,
    };
    try {
      await AuthService.login(userLogin, dispatch, navigate);
      notification.success({
        message: "Login Success",
        description: "Your request has been successfully completed !",
        duration: 2,
        style: { backgroundColor: "#eaffdd  " },
      });
    } catch (error: any) {
      console.log("Login false");
    }
  };

  return (
    <section
      style={{
        height: "0px",
        padding: "0px",
        alignItems: "center",
        display: "flex",
        backgroundColor: "white",
      }}
    >
      <div style={{ margin: "0 auto", width: "380px" }}>
        <div style={{ marginBottom: "100vh" }}>
          <Title>Sign in</Title>
        </div>
        <Form
          onSubmitCapture={handleLogin}
          name="normal_login"
          initialValues={{ remember: true }}
          layout="vertical"
          requiredMark="optional"
        >
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
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={{ float: "right" }}>Forgot password?</a>
          </Form.Item>

          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>

            <div
              style={{
                textAlign: "center",
                width: "100%",
              }}
            >
              <Text style={{}}>Don't have an account? </Text>
              <Link to="/register">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default LoginPage;
