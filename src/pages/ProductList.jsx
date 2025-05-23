import { Table, Input, Button, Space, Tag, Card, Statistic, Row, Col, Select, Avatar, Dropdown, Typography, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, AppstoreOutlined, ShoppingOutlined, AlertOutlined, MoreOutlined, EyeOutlined, ExportOutlined, FilterOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

function ProductList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });

  const navigate = useNavigate();

  // Fetch danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8020/api/v1/categories?page=1&size=100`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        setCategories(result.data.content);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch sản phẩm
  const fetchData = async (page = 1, size = 100, search = '', category = '', status = '') => {
    setLoading(true);
    try {
      let url = `http://localhost:8020/api/v1/products`;
      const queryParams = new URLSearchParams({
        page,
        size,
        sort: 'name',
        direction: 'asc',
        ...(search && { search }),
        ...(status && { status }),
      });

      if (category) {
        url = `http://localhost:8020/api/v1/categories/${category}/products?${queryParams}`;
      } else {
        url = `http://localhost:8020/api/v1/products?${queryParams}`;
      }

      const response = await fetch(url, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      if (result.status === 200) {
        const { content, currentPage, totalPages, totalElements, pageSize } = result.data;
        setData(content.map(item => ({
          ...item,
          status: item.quantity > 0 ? 'In Stock' : 'Out of Stock',
          sku: `SKU${item.id.toString().padStart(3, '0')}`,
          category: getCategoryName(item.categoryId),
        })));
        setTotal(totalElements);
        setInStock(content.filter(item => item.quantity > 0).length);
        setOutOfStock(content.filter(item => item.quantity === 0).length);
        setPagination({
          current: currentPage,
          pageSize,
          total: totalElements,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map categoryId to category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Tải danh mục khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Tải sản phẩm khi categories đã sẵn sàng
  useEffect(() => {
    if (categories.length > 0) {
      fetchData();
    }
  }, [categories]);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const onSearch = (value) => {
    fetchData(1, pagination.pageSize, value);
  };

  const handleCategoryChange = (value) => {
    fetchData(1, pagination.pageSize, '', value);
  };

  const handleStatusChange = (value) => {
    fetchData(1, pagination.pageSize, '', '', value);
  };

  const getStatusColor = (status) => {
    return status === 'In Stock' ? 'success' : 'error';
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { status: 'error', text: 'Out of Stock' };
    if (stock < 10) return { status: 'warning', text: 'Low Stock' };
    return { status: 'success', text: 'In Stock' };
  };

  const actionItems = (record) => [
    {
      key: 'view',
      label: (
        <div className="flex items-center gap-2">
          <EyeOutlined className="text-blue-500" />
          <span>View Details</span>
        </div>
      ),
      onClick: () => navigate(`/product/${record.id}`),
    },
    {
      key: 'update',
      label: (
        <div className="flex items-center gap-2">
          <EditOutlined className="text-yellow-500" />
          <span>Update Product</span>
        </div>
      ),
      onClick: () => navigate(`/update-product/${record.id}`),
    },
    {
      key: 'export',
      label: (
        <div className="flex items-center gap-2">
          <ExportOutlined className="text-green-500" />
          <span>Export Data</span>
        </div>
      ),
      onClick: () => navigate('/export'),
    },
  ];

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar shape="square" size={40} className="bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {text.charAt(0)}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => navigate(`/product/${record.id}`)}>
              {text}
            </div>
            <Text type="secondary" className="text-xs">SKU: {record.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium">{category}</Tag>,
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (stock) => {
        const badge = getStockBadge(stock);
        return (
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 mb-1">{stock}</div>
            <Badge status={badge.status} text={badge.text} className="text-xs" />
          </div>
        );
      },
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)} className="px-3 py-1 rounded-full font-medium">{status}</Tag>,
      filters: [
        { text: 'In Stock', value: 'In Stock' },
        { text: 'Out of Stock', value: 'Out of Stock' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Dropdown menu={{ items: actionItems(record) }} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} className="hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Title level={2} className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Product Management</Title>
            <Text type="secondary" className="text-base">Manage your inventory with powerful tools and insights</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/import')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-6"
          >
            Add New Product
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Statistic title={<span className="text-gray-600 font-medium">Total Products</span>} value={total} prefix={<AppstoreOutlined className="text-blue-500" />} valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Statistic title={<span className="text-gray-600 font-medium">In Stock</span>} value={inStock} prefix={<ShoppingOutlined className="text-green-500" />} valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <Statistic title={<span className="text-gray-600 font-medium">Out of Stock</span>} value={outOfStock} prefix={<AlertOutlined className="text-red-500" />} valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }} />
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-xl rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-2">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Search
                placeholder="Search products, SKU, or category..."
                allowClear
                onSearch={onSearch}
                enterButton={<Button type="primary" className="bg-blue-500 border-blue-500"><SearchOutlined /></Button>}
                size="large"
                className="lg:w-80"
              />
              <Select defaultValue="" size="large" className="sm:w-44" allowClear placeholder="All Categories" suffixIcon={<FilterOutlined />} onChange={handleCategoryChange}>
                <Option value="">All Categories</Option>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
              <Select defaultValue="" size="large" className="sm:w-40" allowClear placeholder="All Status" suffixIcon={<FilterOutlined />} onChange={handleStatusChange}>
                <Option value="">All Status</Option>
                <Option value="In Stock">In Stock</Option>
                <Option value="Out of Stock">Out of Stock</Option>
              </Select>
            </div>
          </div>

          {selectedRowKeys.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-blue-700">{selectedRowKeys.length} item(s) selected</Text>
            </div>
          )}

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            rowSelection={rowSelection}
            loading={loading}
            className="rounded-lg overflow-hidden"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              className: "px-4 py-4",
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            size="large"
          />
        </Card>
      </div>
    </div>
  );
}

export default ProductList;