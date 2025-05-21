import React from 'react';
import { Users, Package, Truck, Store } from 'lucide-react';
import SectionCard from './SectionCard';

const ManageStaff = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SectionCard icon={Users} title="Danh sách nhân viên" description="Xem, phân quyền và cập nhật thông tin nhân viên." color={{ bg: 'bg-yellow-50', border: 'border-yellow-400', icon: 'text-yellow-600' }} />
    <SectionCard icon={Package} title="Lịch làm việc" description="Tổ chức và theo dõi lịch làm việc của nhân viên." color={{ bg: 'bg-purple-50', border: 'border-purple-400', icon: 'text-purple-600' }} />
  </div>
);

export default ManageStaff;