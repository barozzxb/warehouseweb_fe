import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:8020/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        // Lưu token và userId vào localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userId', data.data.userId);
        // Lấy thông tin người dùng để lấy role
        const userResponse = await fetch(`http://localhost:8020/api/v1/users/${data.data.userId}`, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${data.data.token}`,
          },
        });

        const userData = await userResponse.json();
        if (userResponse.ok && userData.status === 200) {
          localStorage.setItem('userRole', userData.data.role); // Lưu role vào localStorage
          window.location.href = '/'; // Làm mới trang để App.jsx lấy role mới
        } else {
          message.error('Không thể lấy thông tin vai trò người dùng!');
        }
      } else {
        message.error(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi đăng nhập!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
          <div className="text-center">
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Quên mật khẩu?
            </a>
            <span className="mx-2">|</span>
            <a href="/signup" className="text-blue-500 hover:underline">
              Đăng ký
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;