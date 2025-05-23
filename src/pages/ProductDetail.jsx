import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Table, Tag, Space } from 'antd';
import { ArrowLeftOutlined, ExportOutlined } from '@ant-design/icons';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const product = {
    id: id,
    name: 'Product 1',
    sku: 'SKU001',
    category: 'Electronics',
    stock: 100,
    price: 99.99,
    description: 'This is a sample product description.',
    status: 'In Stock',
  };

  // Mock history data
  const historyData = [
    {
      id: 1,
      date: '2024-03-20',
      type: 'Import',
      quantity: 50,
      reference: 'IMP001',
    },
    {
      id: 2,
      date: '2024-03-19',
      type: 'Export',
      quantity: -20,
      reference: 'EXP001',
    },
  ];

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Import' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <span className={quantity > 0 ? 'text-green-600' : 'text-red-600'}>
          {quantity > 0 ? `+${quantity}` : quantity}
        </span>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">Product Details</h1>
      </div>

      <Card className="shadow-lg">
        <Descriptions title="Product Information" bordered>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
          <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
          <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
          <Descriptions.Item label="Price">${product.price}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={product.status === 'In Stock' ? 'green' : 'red'}>
              {product.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {product.description}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => navigate('/export')}
          >
            Export Product
          </Button>
        </div>
      </Card>

      <Card title="Stock History" className="shadow-lg">
        <Table
          columns={historyColumns}
          dataSource={historyData}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default ProductDetail; 