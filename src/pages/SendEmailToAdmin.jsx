import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Divider, Typography, Input, message } from 'antd';
import { UserOutlined, MailOutlined, SendOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const SendEmailToAdmin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [errors, setErrors] = useState({});

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8020/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
              'Accept': '*/*',
            },
          });

          const data = await response.json();
          if (response.ok && data.status === 200) {
            setUserInfo(data.data);
          }
        } catch (error) {
          message.error('Lỗi khi lấy thông tin người dùng!');
        }
      }
    };

    fetchUserInfo();
  }, []);

  // Tạo request_id ngẫu nhiên
  const generateRequestId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo số ngẫu nhiên 6 chữ số
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề!';
    }
    if (!messageContent.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi email qua EmailJS
  const sendEmail = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userInfo) {
      message.error('Không thể lấy thông tin người dùng!');
      return;
    }

    setLoading(true);
    const requestId = generateRequestId();
    const emailParams = {
      from_name: userInfo.username,
      from_email: userInfo.email,
      to_email: 'dathiichan141@gmail.com', // Email của Admin
      name: userInfo.username, // Truyền username vào {{name}}
      request_id: requestId, // Truyền request_id vào {{request_id}}
      title: subject, // Truyền subject vào {{title}}
      subject: subject, // Subject của email
      message: messageContent, // Nội dung email
    };

    try {
      // Note: EmailJS would need to be imported and configured properly in a real environment
      // await emailjs.send(
      //   'service_ogmuzm6', // Service ID
      //   'template_11m221n', // Template ID
      //   emailParams,
      //   'ypkcLezyRQZtc-JAz' // Public Key
      // );
      
      // Simulating email send for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Email đã được gửi thành công!');
      setSubject('');
      setMessageContent('');
      setErrors({});
    } catch (error) {
      message.error('Gửi email thất bại! ' + error.text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 25%, #f3e8ff 75%, #faf0ff 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '50%',
            marginBottom: '16px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <MailOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <Title level={1} style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Liên hệ với Admin
          </Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>
            Gửi tin nhắn trực tiếp đến quản trị viên hệ thống
          </Text>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* User Info Card */}
          <Card 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              height: 'fit-content'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}
                />
              </div>
              
              {userInfo ? (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <Text strong style={{ fontSize: '18px', color: '#1f2937', display: 'block' }}>
                      {userInfo.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {userInfo.role}
                    </Text>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MailOutlined style={{ color: '#3b82f6' }} />
                        <Text style={{ 
                          fontSize: '14px', 
                          color: '#6b7280',
                          wordBreak: 'break-all'
                        }}>
                          {userInfo.email}
                        </Text>
                      </div>
                    </Space>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    height: '16px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                  <div style={{
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                  <div style={{
                    height: '32px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                </div>
              )}
            </div>
          </Card>

          {/* Email Form */}
          <Card 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              gridColumn: 'span 2'
            }}
          >
            <Title level={3} style={{ 
              color: '#1f2937', 
              marginBottom: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <EditOutlined style={{ color: '#3b82f6' }} />
              Soạn tin nhắn
            </Title>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Subject Field */}
              <div>
                <div style={{
                  color: '#374151',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <MessageOutlined style={{ color: '#3b82f6' }} />
                  Tiêu đề
                </div>
                <Input 
                  placeholder="Nhập tiêu đề email" 
                  size="large"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) {
                      setErrors({...errors, subject: null});
                    }
                  }}
                  status={errors.subject ? 'error' : ''}
                  style={{
                    borderRadius: '8px',
                    border: errors.subject ? '1px solid #ef4444' : '1px solid #d1d5db',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {errors.subject && (
                  <Text type="danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {errors.subject}
                  </Text>
                )}
              </div>
              
              {/* Message Field */}
              <div>
                <div style={{
                  color: '#374151',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <EditOutlined style={{ color: '#3b82f6' }} />
                  Nội dung
                </div>
                <TextArea 
                  rows={6} 
                  placeholder="Nhập nội dung email..."
                  value={messageContent}
                  onChange={(e) => {
                    setMessageContent(e.target.value);
                    if (errors.message) {
                      setErrors({...errors, message: null});
                    }
                  }}
                  status={errors.message ? 'error' : ''}
                  style={{
                    borderRadius: '8px',
                    border: errors.message ? '1px solid #ef4444' : '1px solid #d1d5db',
                    boxShadow: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s ease'
                  }}
                />
                {errors.message && (
                  <Text type="danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {errors.message}
                  </Text>
                )}
              </div>
              
              {/* Submit Button */}
              <div style={{ paddingTop: '16px' }}>
                <Button 
                  type="primary" 
                  onClick={sendEmail}
                  loading={loading}
                  size="large"
                  icon={<SendOutlined />}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: loading ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi Email'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Email sẽ được gửi trực tiếp đến quản trị viên
            </Text>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
};

export default SendEmailToAdmin;