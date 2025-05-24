import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Space, Typography, Divider, Progress } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, LoginOutlined, CheckCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text, Link } = Typography;

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [form] = Form.useForm();

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return '#ff4d4f';
    if (strength < 50) return '#faad14';
    if (strength < 75) return '#1890ff';
    return '#52c41a';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return 'Yếu';
    if (strength < 50) return 'Trung bình';
    if (strength < 75) return 'Khá';
    return 'Mạnh';
  };

  const onFinish = async (values) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '12%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '45%',
        right: '5%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)'
      }} />

      <Card 
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '48px 40px 40px' }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <UserAddOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          
          <Title level={2} style={{ 
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '28px'
          }}>
            Tạo tài khoản mới
          </Title>
          <Text type="secondary" style={{ fontSize: '15px', fontWeight: 500 }}>
            Đăng ký để bắt đầu sử dụng hệ thống
          </Text>
        </div>

        <Form 
          name="signup" 
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            style={{ marginBottom: '20px' }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#667eea' }} />} 
              placeholder="Tên đăng nhập" 
              style={{
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                padding: '12px 16px',
                fontSize: '15px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
            style={{ marginBottom: '20px' }}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#667eea' }} />} 
              placeholder="Email" 
              style={{
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                padding: '12px 16px',
                fontSize: '15px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
            ]}
            style={{ marginBottom: '20px' }}
          >
            <Input 
              prefix={<PhoneOutlined style={{ color: '#667eea' }} />} 
              placeholder="Số điện thoại" 
              style={{
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                padding: '12px 16px',
                fontSize: '15px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#667eea' }} />} 
              placeholder="Mật khẩu"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={handlePasswordChange}
              style={{
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                padding: '12px 16px',
                fontSize: '15px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          {passwordStrength > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <Progress 
                percent={passwordStrength}
                strokeColor={getPasswordStrengthColor(passwordStrength)}
                showInfo={false}
                size="small"
                style={{ marginBottom: '4px' }}
              />
              <Text 
                style={{ 
                  fontSize: '12px', 
                  color: getPasswordStrengthColor(passwordStrength),
                  fontWeight: 500
                }}
              >
                Độ mạnh mật khẩu: {getPasswordStrengthText(passwordStrength)}
              </Text>
            </div>
          )}

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
            style={{ marginBottom: '32px' }}
          >
            <Input.Password 
              prefix={<CheckCircleOutlined style={{ color: '#667eea' }} />} 
              placeholder="Xác nhận mật khẩu"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                padding: '12px 16px',
                fontSize: '15px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
              }}
            >
              <UserAddOutlined style={{ marginRight: '8px' }} />
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </Form.Item>

          <Divider style={{ 
            margin: '24px 0',
            borderColor: '#e8e8e8'
          }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>Hoặc</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Space size="middle">
              <LoginOutlined style={{ color: '#667eea' }} />
              <Text type="secondary">Đã có tài khoản?</Text>
              <Link 
                href="/login" 
                style={{ 
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#764ba2';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#667eea';
                  e.target.style.textDecoration = 'none';
                }}
              >
                Đăng nhập ngay
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;