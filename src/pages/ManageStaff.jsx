import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ManageStaff = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách Staff
  const fetchAccounts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8020/api/v1/users?page=${page}&size=${pageSize}&sort=username&direction=asc&role=STAFF`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 200) {
        setAccounts(data.data.content);
        setTotalElements(data.data.totalElements);
        setCurrentPage(data.data.currentPage);
      } else {
        message.error(data.message || 'Lấy danh sách Staff thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách Staff!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1);
  }, []);

  // Xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAccounts(page);
  };

  // Mở modal để thêm hoặc chỉnh sửa Staff
  const showModal = (staff = null) => {
    setEditingStaff(staff);
    if (staff) {
      form.setFieldsValue(staff);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    form.resetFields();
  };

  // Tạo hoặc cập nhật Staff
  const handleSubmit = async (values) => {
    try {
      if (editingStaff) {
        // Cập nhật Staff (PUT)
        const response = await fetch(`http://localhost:8020/api/v1/users/${editingStaff.id}`, {
          method: 'PUT',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...values, role: 'STAFF' }),
        });

        const data = await response.json();
        if (response.ok && data.status === 200) {
          message.success(data.message || 'Cập nhật Staff thành công!');
          fetchAccounts(currentPage);
        } else {
          message.error(data.message || 'Cập nhật Staff thất bại!');
        }
      } else {
        // Tạo Staff mới (POST)
        const response = await fetch('http://localhost:8020/api/v1/users', {
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...values, role: 'STAFF' }),
        });

        const data = await response.json();
        if (response.ok && data.status === 201) {
          message.success(data.message || 'Thêm Staff thành công!');
          fetchAccounts(currentPage);
        } else {
          message.error(data.message || 'Thêm Staff thất bại!');
        }
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Đã xảy ra lỗi!');
    }
  };

  // Xóa Staff (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8020/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = response.status !== 204 ? await response.json() : { status: 204, message: 'Xóa người dùng thành công' };
      if (response.ok && data.status === 204) {
        message.success(data.message || 'Xóa Staff thành công!');
        fetchAccounts(currentPage);
      } else {
        message.error(data.message || 'Xóa Staff thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa Staff!');
    }
  };

  // Cột của bảng
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
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa Staff này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Staff</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="bg-green-500 hover:bg-green-600 flex items-center"
        >
          Thêm Staff
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        className="shadow-sm rounded-lg"
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

      {/* Modal để thêm hoặc sửa Staff */}
      <Modal
        title={editingStaff ? 'Chỉnh sửa Staff' : 'Thêm Staff mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="p-4"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: !editingStaff, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} className="border-gray-300">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
              {editingStaff ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStaff;