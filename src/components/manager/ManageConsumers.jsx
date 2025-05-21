import React from 'react';
import { Users, Package, Truck, Store } from 'lucide-react';
import SectionCard from './SectionCard';

const ManageConsumers = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SectionCard icon={Store} title="Danh sách khách hàng" description="Quản lý thông tin và lịch sử mua hàng của khách hàng." color={{ bg: 'bg-pink-50', border: 'border-pink-400', icon: 'text-pink-600' }} />
    <SectionCard icon={Users} title="Phân nhóm khách hàng" description="Tạo và quản lý các nhóm khách hàng để chăm sóc tốt hơn." color={{ bg: 'bg-emerald-50', border: 'border-emerald-400', icon: 'text-emerald-600' }} />
  </div>
);

export default ManageConsumers;