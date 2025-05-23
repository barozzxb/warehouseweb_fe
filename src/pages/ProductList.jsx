import { Table, Input, Button, Space, Tag, Card, Statistic, Row, Col, Select } from 'antd';
import { SearchOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

function ProductList() {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const data = [
    {
      id: 1,
      name: 'Product 1',
      sku: 'SKU001',
      category: 'Electronics',
      stock: 100,
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Product 2',
      sku: 'SKU002',
      category: 'Clothing',
      stock: 0,
      status: 'Out of Stock',
    },
    {
      id: 3,
      name: 'Product 3',
      sku: 'SKU003',
      category: 'Furniture',
      stock: 25,
      status: 'In Stock',
    },
  ];

  const total = data.length;
  const inStock = data.filter((d) => d.status === 'In Stock').length;
  const outOfStock = data.filter((d) => d.status !== 'In Stock').length;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/product/${record.id}`)} className="font-medium text-blue-600 hover:underline">{text}</a>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => <span className="font-semibold">{stock}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'In Stock' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/product/${record.id}`)}>
            View
          </Button>
          <Button type="link" onClick={() => navigate('/export')}>
            Export
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={16} className="mb-2">
        <Col span={8}>
          <Card bordered={false} className="shadow">
            <Statistic title="Total Products" value={total} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow">
            <Statistic title="In Stock" value={inStock} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow">
            <Statistic title="Out of Stock" value={outOfStock} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>
      <Card bordered={false} className="shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex gap-2">
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              className="w-64"
            />
            <Select defaultValue="" className="w-40" allowClear placeholder="Category">
              <Option value="">All Categories</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Furniture">Furniture</Option>
            </Select>
            <Select defaultValue="" className="w-40" allowClear placeholder="Status">
              <Option value="">All Status</Option>
              <Option value="In Stock">In Stock</Option>
              <Option value="Out of Stock">Out of Stock</Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/import')}
          >
            Add Product
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          className="bg-white rounded-lg"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}

export default ProductList; 