import React, { useState, useEffect } from 'react';
import { Table, Select, Pagination, message } from 'antd';

const { Option } = Select;

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
    setCurrentPage(1); // Reset về trang 1 khi thay đổi role
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách tài khoản</h2>
      <div className="mb-4">
        <span className="mr-2">Chọn vai trò:</span>
        <Select value={role} onChange={handleRoleChange} style={{ width: 150 }}>
          <Option value="STAFF">STAFF</Option>
          <Option value="MANAGER">MANAGER</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalElements}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ViewAccountList;