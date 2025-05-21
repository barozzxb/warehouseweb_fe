import { Package, Users, BarChart2 } from 'lucide-react';

const features = [
  {
    title: 'Quản lý sản phẩm',
    description: 'Xem, sửa, nhập và xuất kho hàng hóa một cách dễ dàng.',
    icon: <Package size={36} className="text-blue-600 mb-4" />,
  },
  {
    title: 'Theo dõi nhân viên',
    description: 'Phân quyền và giám sát công việc nhân viên trực quan.',
    icon: <Users size={36} className="text-green-600 mb-4" />,
  },
  {
    title: 'Phân tích doanh thu',
    description: 'Tổng hợp và theo dõi doanh thu theo thời gian thực.',
    icon: <BarChart2 size={36} className="text-purple-600 mb-4" />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-100 p-10">
      <div className="w-full mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
              <div className="flex justify-center">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
