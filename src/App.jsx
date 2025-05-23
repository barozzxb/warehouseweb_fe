import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ImportProduct from './pages/ImportProduct';
import ExportProduct from './pages/ExportProduct';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ViewAccountList from './pages/ViewAccountList';
import SendEmailToAdmin from './pages/SendEmailToAdmin';
import { useState, useEffect } from 'react';
import ManageStaff from './pages/ManageStaff';
import UpdateProduct from './pages/UpdateProduct';
const { Content } = Layout;

// Placeholder components for new routes
const ManageStaffs = () => <div><h2>Manage Staffs Page</h2></div>;
const ManageSuppliers = () => <div><h2>Manage Suppliers Page</h2></div>;
const ManageConsumers = () => <div><h2>Manage Consumers Page</h2></div>;
const SupportUser = () => <div><h2>Support User Page</h2></div>;

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId');
      if (userId && !userRole) {
        try {
          const response = await fetch(`http://localhost:8020/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
              'Accept': '*/*',
            },
          });

          const data = await response.json();
          if (response.ok && data.status === 200) {
            setUserRole(data.data.role);
            localStorage.setItem('userRole', data.data.role);
            console.log('User role:', data.data.role);
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  // Component bảo vệ route dựa trên role
  const ProtectedRoute = ({ roleRequired, children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
    if (roleRequired && !roleRequired.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Các trang không cần Layout và không cần đăng nhập */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Các trang cần Layout và phân quyền */}
        <Route
          path="*"
          element={
            <Layout className="min-h-screen">
              <Sidebar />
              <Layout>
                <Header />
                <Content className="p-6 bg-gray-50 min-h-screen">
                  <Routes>
                    {/* Các route chung cho STAFF và MANAGER */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute roleRequired={['STAFF', 'MANAGER'].includes(userRole) ? userRole : null}>
                          <ProductList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/product/:id"
                      element={
                        <ProtectedRoute roleRequired={['STAFF', 'MANAGER'].includes(userRole) ? userRole : null}>
                          <ProductDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/send-email"
                      element={
                        <ProtectedRoute roleRequired={['STAFF', 'MANAGER'].includes(userRole) ? userRole : null}>
                          <SendEmailToAdmin />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route cho STAFF */}
                    <Route
                      path="/import"
                      element={
                        <ProtectedRoute roleRequired="STAFF">
                          <ImportProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/export"
                      element={
                        <ProtectedRoute roleRequired="STAFF">
                          <ExportProduct />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route cho MANAGER */}
                    <Route
                      path="/update-product/:id"
                      element={
                        <ProtectedRoute roleRequired="MANAGER">
                          <UpdateProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/manage-staffs"
                      element={
                        <ProtectedRoute roleRequired="MANAGER">
                          <ManageStaff />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/manage-suppliers"
                      element={
                        <ProtectedRoute roleRequired="MANAGER">
                          <ManageSuppliers />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/manage-consumers"
                      element={
                        <ProtectedRoute roleRequired="MANAGER">
                          <ManageConsumers />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route cho ADMIN */}
                    <Route
                      path="/account-list"
                      element={
                        <ProtectedRoute roleRequired="ADMIN">
                          <ViewAccountList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/support-user"
                      element={
                        <ProtectedRoute roleRequired="ADMIN">
                          <SupportUser />
                        </ProtectedRoute>
                      }
                    />

                    {/* Redirect nếu không có quyền truy cập */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Content>
                </Layout>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;