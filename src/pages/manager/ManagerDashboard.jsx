import React from 'react';
import Sidebar from '../../components/manager/SideBar';
import ManageSuppliers from '../../components/manager/ManageSuppliers';
import ManageConsumers from '../../components/manager/ManageConsumers';
import ManageStaff from '../../components/manager/ManageStaff';
import ManagerProfile from '../../components/manager/ManagerProfile';


const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = React.useState('suppliers');

    const renderTab = () => {
        switch (activeTab) {
            case 'suppliers': return <ManageSuppliers />;
            case 'consumers': return <ManageConsumers />;
            case 'staff': return <ManageStaff />;
            case 'profile': return <ManagerProfile />;
            default: return null;
        }
    };

    return (
        <div className="flex w-full bg-white">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-10 bg-gradient-to-br from-gray-50 to-gray-200">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-8">📊 Bảng Điều Khiển Quản Lý</h1>
                {renderTab()}
            </main>
        </div>
    );
};

export default ManagerDashboard;
