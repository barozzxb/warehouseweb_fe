import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ImportProduct from './pages/ImportProduct';
import ExportProduct from './pages/ExportProduct';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Sidebar />
        <Layout>
          <Header />
          <Content className="p-6 bg-gray-50 min-h-screen">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/import" element={<ImportProduct />} />
              <Route path="/export" element={<ExportProduct />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
