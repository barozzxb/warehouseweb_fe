const features = [
  { title: 'Quản lý sản phẩm', description: 'Xem, sửa, nhập và xuất kho hàng hóa một cách dễ dàng.' },
  { title: 'Theo dõi nhân viên', description: 'Phân quyền và giám sát công việc nhân viên trực quan.' },
  { title: 'Phân tích doanh thu', description: 'Tổng hợp và theo dõi doanh thu theo thời gian thực.' },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-100 p-10">
      <div className="w-full mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
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
