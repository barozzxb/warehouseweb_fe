import { Layout, Menu, Avatar, Divider } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  ImportOutlined,
  ExportOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar() {
  const location = useLocation();

  const menuItems = [
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
  ];

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
          <div className="font-semibold text-gray-700">Admin User</div>
          <div className="text-xs text-gray-400">Administrator</div>
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar; 