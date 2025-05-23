import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đổi mật khẩu
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // OTP giả lập
  const navigate = useNavigate();

  // Giả lập gửi OTP
  const sendOtp = (email) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP 6 số
    setOtp(generatedOtp);
    console.log(`OTP sent to ${email}: ${generatedOtp}`); // Thay bằng API gửi email thật
    message.success('Mã OTP đã được gửi đến email của bạn!');
  };

  // Bước 1: Xử lý gửi email
  const onFinishEmail = (values) => {
    setEmail(values.email);
    sendOtp(values.email);
    setStep(2);
  };

  // Bước 2: Xử lý nhập OTP
  const onFinishOtp = (values) => {
    if (values.otp === otp) {
      message.success('Xác thực OTP thành công!');
      setStep(3);
    } else {
      message.error('Mã OTP không đúng!');
    }
  };

  // Bước 3: Xử lý đổi mật khẩu
  const onFinishPassword = (values) => {
    console.log('New password:', values.password);
    message.success('Đổi mật khẩu thành công!');
    navigate('/login'); // Chuyển đến trang login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? 'Quên mật khẩu' : step === 2 ? 'Xác thực OTP' : 'Đổi mật khẩu'}
        </h2>

        {/* Bước 1: Nhập email */}
        {step === 1 && (
          <Form name="forgot-password" onFinish={onFinishEmail}>
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Gửi mã OTP
              </Button>
            </Form.Item>
            <div className="text-center">
              <a href="/login" className="text-blue-500 hover:underline">
                Quay lại đăng nhập
              </a>
            </div>
          </Form>
        )}

        {/* Bước 2: Nhập OTP */}
        {step === 2 && (
          <Form name="otp" onFinish={onFinishOtp}>
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
            >
              <Input placeholder="Nhập mã OTP 6 số" maxLength={6} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Xác thực
              </Button>
            </Form.Item>
            <div className="text-center">
              <Button
                type="link"
                onClick={() => sendOtp(email)}
                className="text-blue-500 hover:underline"
              >
                Gửi lại OTP
              </Button>
            </div>
          </Form>
        )}

        {/* Bước 3: Đổi mật khẩu */}
        {step === 3 && (
          <Form name="new-password" onFinish={onFinishPassword}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
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
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;