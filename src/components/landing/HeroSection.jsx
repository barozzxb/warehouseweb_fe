import { Link } from "react-router-dom";
import { Warehouse, Users, BarChart3 } from "lucide-react";

import warehouse from "../../assets/images/warehouse.webp";

const HeroSection = () => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-700 to-purple-800 text-white px-6 md:px-16 py-10 relative overflow-hidden">

      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <div className="z-10 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow">
          Quản lý kho hàng thông minh, hiệu quả và tiện lợi
        </h1>
        <p className="text-lg md:text-xl mb-6 drop-shadow">
          Giải pháp hiện đại giúp bạn kiểm soát hàng hóa, nhân sự và doanh thu chỉ trong một nền tảng duy nhất.
        </p>

        <ul className="mb-8 space-y-2 text-left text-base md:text-lg">
          <li className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-green-300" />
            Theo dõi tồn kho và hàng hóa chính xác
          </li>
          <li className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-300" />
            Quản lý nhân viên và phân quyền linh hoạt
          </li>
          <li className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pink-300" />
            Báo cáo doanh thu trực quan, dễ hiểu
          </li>
        </ul>

        <Link to="/login">
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-xl hover:bg-gray-100 transition-all duration-300">
            Đăng nhập ngay
          </button>
        </Link>
      </div>
      <div className="hidden md:block z-10 ml-12">
        <img
          src={warehouse}
          alt="Warehouse Illustration"
          className="w-[800px] rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default HeroSection;
