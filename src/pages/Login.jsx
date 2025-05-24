import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Space, Typography, Divider } from 'antd';
import { LockOutlined, UserOutlined, LoginOutlined, KeyOutlined, UserAddOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
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
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '5%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)'
      }} />

      <Card 
        style={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.2)',
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
            <LoginOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          
          <Title level={2} style={{ 
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '28px'
          }}>
            Chào mừng trở lại!
          </Title>
          <Text type="secondary" style={{ fontSize: '15px', fontWeight: 500 }}>
            Đăng nhập để tiếp tục vào hệ thống
          </Text>
        </div>

        <Form 
          name="login" 
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            style={{ marginBottom: '24px' }}
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
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            style={{ marginBottom: '32px' }}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#667eea' }} />} 
              placeholder="Mật khẩu"
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
              <LoginOutlined style={{ marginRight: '8px' }} />
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>

          <Divider style={{ 
            margin: '24px 0',
            borderColor: '#e8e8e8'
          }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>Hoặc</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Space size="large" direction="vertical" style={{ width: '100%' }}>
              <Space size="middle">
                <KeyOutlined style={{ color: '#667eea' }} />
                <Link 
                  href="/forgot-password" 
                  style={{ 
                    color: '#667eea',
                    fontWeight: 500,
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
                  Quên mật khẩu?
                </Link>
              </Space>
              
              <Space size="middle">
                <UserAddOutlined style={{ color: '#667eea' }} />
                <Text type="secondary">Chưa có tài khoản?</Text>
                <Link 
                  href="/signup" 
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
                  Đăng ký ngay
                </Link>
              </Space>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;