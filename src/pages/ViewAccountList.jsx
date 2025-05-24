import React, { useState, useEffect } from 'react';
import { Table, Select, Pagination, message, Card, Space, Typography, Badge, Avatar, Input, Button } from 'antd';
import { UserOutlined, SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const ViewAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [role, setRole] = useState('STAFF');
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async (page = 1, selectedRole = role) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8020/api/v1/users?page=${page}&size=${pageSize}&sort=username&direction=asc&role=${selectedRole}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 200) {
        setAccounts(data.data.content);
        setTotalElements(data.data.totalElements);
        setCurrentPage(data.data.currentPage);
      } else {
        message.error(data.message || 'Lấy danh sách người dùng thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1, role);
  }, [role]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAccounts(page);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchAccounts(currentPage, role);
  };

  const getRoleBadgeColor = (userRole) => {
    switch (userRole) {
      case 'MANAGER':
        return 'gold';
      case 'STAFF':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (userRole) => {
    switch (userRole) {
      case 'MANAGER':
        return '⚒️';
      case 'STAFF':
        return '👤';
      default:
        return '👤';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <Text strong style={{ color: '#1890ff' }}>
          #{id}
        </Text>
      ),
    },
    {
      title: 'Thông tin người dùng',
      key: 'userInfo',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: record.role === 'MANAGER' ? '#faad14' : '#1890ff',
              border: '2px solid #f0f0f0'
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>
              {record.username}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Text style={{ fontFamily: 'monospace' }}>
          {phone || <Text type="secondary">Chưa cập nhật</Text>}
        </Text>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (userRole) => (
        <Badge 
          color={getRoleBadgeColor(userRole)}
          text={
            <span style={{ fontWeight: 500 }}>
              {getRoleIcon(userRole)} {userRole}
            </span>
          }
        />
      ),
    },
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Card 
        style={{ 
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}>
            📋 Danh sách tài khoản
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Quản lý và xem thông tin tài khoản người dùng
          </Text>
        </div>

        <Card 
          size="small" 
          style={{ 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          <Space size="middle" wrap>
            <Space>
              <FilterOutlined style={{ color: '#fa8c16' }} />
              <Text strong style={{ color: '#8c4100' }}>Bộ lọc:</Text>
              <Select 
                value={role} 
                onChange={handleRoleChange} 
                style={{ width: 160 }}
                size="middle"
                suffixIcon={<UserOutlined />}
              >
                <Option value="STAFF">👤 STAFF</Option>
                <Option value="MANAGER">👑 MANAGER</Option>
              </Select>
            </Space>
            
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white'
              }}
              loading={loading}
            >
              Làm mới
            </Button>

            <div style={{ 
              padding: '8px 16px', 
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <Text strong style={{ color: '#8c4100' }}>
                📊 Tổng: {totalElements} tài khoản
              </Text>
            </div>
          </Space>
        </Card>

        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={false}
          bordered={false}
          style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'even-row' : 'odd-row'
          }
        />

        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          borderRadius: '12px'
        }}>
          <Text style={{ color: '#8c4100', fontWeight: 500 }}>
            Hiển thị {Math.min(pageSize, totalElements - (currentPage - 1) * pageSize)} / {totalElements} kết quả
          </Text>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalElements}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{
              '& .ant-pagination-item-active': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }
            }}
          />
        </div>
      </Card>

      <style jsx>{`
        .even-row {
          background-color: #fafafa !important;
        }
        .odd-row {
          background-color: white !important;
        }
        .even-row:hover, .odd-row:hover {
          background-color: #e6f7ff !important;
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ViewAccountList;