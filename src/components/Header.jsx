import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu } from 'antd';

const userMenu = (
  <Menu>
    <Menu.Item key="profile">Profile</Menu.Item>
    <Menu.Item key="logout">Logout</Menu.Item>
  </Menu>
);

function Header() {
  return (
    <div className="flex items-center justify-between h-16 px-8 bg-white border-b shadow-sm">
      <div className="text-2xl font-bold text-blue-700 tracking-tight">Warehouse Management</div>
      <div className="flex items-center space-x-6">
        <Badge count={3} size="small">
          <BellOutlined className="text-xl text-gray-500 hover:text-blue-600 cursor-pointer" />
        </Badge>
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar size={36} icon={<UserOutlined />} className="cursor-pointer bg-blue-600" />
        </Dropdown>
      </div>
    </div>
  );
}

export default Header; 