const Sidebar = ({ activeTab, setActiveTab }) => {
  const handleProfile = () => alert('Go to profile');
  const handleLogout = () => alert('Logout');

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-400 text-white min-h-screen p-6 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10 select-none text-white drop-shadow-md">
          📦 Quản Lý Kho
        </h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`w-full box-border text-left px-4 py-2 rounded-lg font-semibold tracking-wide transition 
              ${activeTab === 'suppliers'
                ? 'bg-white text-blue-900 shadow-md'
                : 'hover:bg-blue-800 text-black'}`}
          >
            Nhà cung cấp
          </button>
          <button
            onClick={() => setActiveTab('consumers')}
            className={`w-full box-border text-left px-4 py-2 rounded-lg font-semibold tracking-wide transition 
              ${activeTab === 'consumers'
                ? 'bg-white text-blue-900 shadow-md'
                : 'hover:bg-blue-800 text-black'}`}
          >
            Khách hàng
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`w-full box-border text-left px-4 py-2 rounded-lg font-semibold tracking-wide transition 
              ${activeTab === 'staff'
                ? 'bg-white text-blue-900 shadow-md'
                : 'hover:bg-blue-800 text-black'}`}
          >
            Nhân viên
          </button>
        </nav>
      </div>

      {/* Account Section */}
      <div className="mt-10 pt-6 border-t border-blue-700">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <p className="font-semibold text-white drop-shadow-md">Nguyễn Văn A</p>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full box-border mb-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 font-semibold transition
          ${activeTab === 'profile'
              ? 'bg-white text-blue-900 shadow-md'
              : 'hover:bg-blue-800 text-black'}`}
        >
          Hồ sơ
        </button>
        <button
          onClick={handleLogout}
          className="w-full box-border px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-black transition"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
