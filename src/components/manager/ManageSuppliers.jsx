import React from 'react';
import { Users, Package, Truck, Store } from 'lucide-react';
import SectionCard from './SectionCard';

const ManageSuppliers = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SectionCard icon={Truck} title="Danh sách nhà cung cấp" description="Xem và chỉnh sửa thông tin nhà cung cấp." color={{ bg: 'bg-blue-50', border: 'border-blue-400', icon: 'text-blue-600' }} />
    <SectionCard icon={Package} title="Lịch sử nhập hàng" description="Theo dõi các đợt nhập hàng từ nhà cung cấp." color={{ bg: 'bg-indigo-50', border: 'border-indigo-400', icon: 'text-indigo-600' }} />
  </div>
);

export default ManageSuppliers;