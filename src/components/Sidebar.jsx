import { Layout, Menu, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  ImportOutlined,
  ExportOutlined,
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Sider } = Layout;

function Sidebar() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ username: 'Admin User', role: 'Administrator' });
  const [menuItems, setMenuItems] = useState([]);

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
            const role = data.data.role;
            setUserInfo({
              username: data.data.username,
              role: role,
            });

            // Cập nhật menuItems dựa trên role
            let items = [];
            if (role === 'STAFF') {
              items = [
                {
                  key: '/',
                  icon: <ShoppingOutlined />,
                  label: <Link to="/">Product List</Link>,
                },
                {
                  key: '/import',
                  icon: <ImportOutlined />,
                  label: <Link to="/import">Import Product</Link>,
                },
                {
                  key: '/export',
                  icon: <ExportOutlined />,
                  label: <Link to="/export">Export Product</Link>,
                },
                {
                  key: '/export-file',
                  icon: <ExportOutlined />,
                  label: <Link to="/export-file">Export Files</Link>,
                },
                {
                  key: '/send-email',
                  icon: <MailOutlined />, // Thêm icon email
                  label: <Link to="/send-email">Send Email to Admin</Link>,
                },
              ];
            } else if (role === 'MANAGER') {
              items = [
                {
                  key: '/',
                  icon: <ShoppingOutlined />,
                  label: <Link to="/">Product List</Link>,
                },
                {
                  key: '/update-product',
                  icon: <ShoppingOutlined />,
                  label: <Link to="/update-product">Update Product</Link>,
                },
                {
                  key: '/manage-staffs',
                  icon: <TeamOutlined />,
                  label: <Link to="/manage-staffs">Manage Staffs</Link>,
                },
                {
                  key: '/manage-suppliers',
                  icon: <ShopOutlined />,
                  label: <Link to="/manage-suppliers">Manage Suppliers</Link>,
                },
                {
                  key: '/manage-consumers',
                  icon: <UsergroupAddOutlined />,
                  label: <Link to="/manage-consumers">Manage Consumers</Link>,
                },
                {
                  key: '/send-email',
                  icon: <MailOutlined />, // Thêm icon email
                  label: <Link to="/send-email">Send Email to Admin</Link>,
                },
              ];
            } else if (role === 'ADMIN') {
              items = [
                {
                  key: '/account-list',
                  icon: <FileTextOutlined />,
                  label: <Link to="/account-list">View Account List</Link>,
                },
                {
                  key: '/support-user',
                  icon: <CustomerServiceOutlined />,
                  label: <Link to="/support-user">Support User</Link>,
                },
              ];
            }
            setMenuItems(items);
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Sider
      theme="light"
      className="min-h-screen shadow-md flex flex-col justify-between"
      width={250}
    >
      <div>
        <div className="h-20 flex items-center justify-center border-b">
          <Avatar size={48} icon={<UserOutlined />} className="bg-blue-600" />
          <span className="ml-3 text-xl font-bold text-gray-800">Warehouse</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-r-0 mt-2"
        />
      </div>
      <div className="p-4 border-t flex items-center space-x-3">
        <Avatar size={32} icon={<UserOutlined />} />
        <div>
          <div className="font-semibold text-gray-700">{userInfo.username}</div>
          <div className="text-xs text-gray-400">{userInfo.role}</div>
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;