import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Table, Tag, Space, Typography } from 'antd';
import { ArrowLeftOutlined, ExportOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

const { Title } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product details from API
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8020/api/v1/products/${id}`, {
        headers: { 'Accept': '*/*' },
      });
      const result = await response.json();
      if (result.status === 200) {
        setProduct({
          id: result.data.id,
          name: result.data.name,
          sku: `SKU${result.data.id.toString().padStart(3, '0')}`, // Generate SKU
          category: getCategoryName(result.data.categoryId), // Map categoryId to name
          stock: result.data.quantity,
          price: result.data.unitPrice,
          description: result.data.location ? `Stored at ${result.data.location}` : 'No location specified',
          status: result.data.quantity > 0 ? 'In Stock' : 'Out of Stock',
          entryDate: result.data.entryDate,
          expiryDate: result.data.expiryDate || 'N/A',
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map categoryId to category name (mocked, replace with actual mapping)
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      2: 'Electronics',
      6: 'Clothing',
      7: 'Clothing',
      8: 'Furniture',
      12: 'Automotive',
      13: 'Stationery',
      14: 'Food',
      18: 'Medical',
    };
    return categoryMap[categoryId] || 'Unknown';
  };

  // Initial fetch
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Mock history data (replace with actual API call if available)
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Back
          </Button>
          <Title level={2} className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Details
          </Title>
        </div>

        <Card className="border-0 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm" loading={loading}>
          <Descriptions title="Product Information" bordered column={2}>
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
            <Descriptions.Item label="Entry Date">{new Date(product.entryDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Expiry Date">{product.expiryDate}</Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {product.description}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6 flex justify-end">
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={() => navigate('/export')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
            >
              Export Product
            </Button>
          </div>
        </Card>

        <Card
          title="Stock History"
          className="border-0 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm"
        >
          <Table
            columns={historyColumns}
            dataSource={historyData}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}

export default ProductDetail;