import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
    const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:8020/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
        }),
      });

      if (response.ok) {
        message.success('Đăng ký thành công!');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi đăng ký!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <Form name="signup" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng ký
            </Button>
          </Form.Item>
          <div className="text-center">
            <span>Đã có tài khoản? </span>
            <a href="/login" className="text-blue-500 hover:underline">
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;