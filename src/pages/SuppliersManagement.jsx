import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Modal, Descriptions, Spin, Card, Badge, Tag, Statistic, Row, Col, Avatar, Tooltip } from 'antd';
import { 
  ShopOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  ShoppingCartOutlined, 
  TransactionOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  NumberOutlined
} from '@ant-design/icons';

const { Option } = Select;

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseNames, setWarehouseNames] = useState({}); // Lưu trữ tên kho
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [productSuppliers, setProductSuppliers] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Fetch danh sách nhà cung cấp
  const fetchSuppliers = async (page = 1, size = 10, sort = 'id', direction = 'asc') => {
    try {
      const response = await fetch(
        `http://localhost:8020/api/v1/suppliers?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
        { headers: { Accept: '*/*' } }
      );
      const data = await response.json();
      setSuppliers(data.data.content || []);
      setPagination({
        current: data.data.currentPage,
        pageSize: data.data.pageSize,
        total: data.data.totalElements,
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    }
  };

  // Fetch danh sách kho
  const fetchWarehouses = async () => {
    try {
      const response = await fetch('http://localhost:8020/api/v1/warehouses', {
        headers: { Accept: '*/*' },
      });
      const data = await response.json();
      const warehouseList = Array.isArray(data.data) ? data.data : [];
      setWarehouses(warehouseList);

      // Lấy tên kho và lưu vào state
      const names = {};
      for (const warehouse of warehouseList) {
        names[warehouse.id] = warehouse.name;
      }
      setWarehouseNames(names);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setWarehouses([]);
      setWarehouseNames({});
    }
  };

  // Fetch chi tiết giao dịch
  const fetchTransactions = async (transactionIds) => {
    if (!transactionIds || transactionIds.length === 0) {
      setTransactions([]);
      return;
    }
    try {
      const promises = transactionIds.map((id) =>
        fetch(`http://localhost:8020/api/v1/transactions/${id}`, {
          headers: { Accept: '*/*' },
        }).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      setTransactions(results.map((res) => res.data || {}).filter(Boolean));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  // Fetch chi tiết sản phẩm cung cấp
  const fetchProductSuppliers = async (productSupplierIds) => {
    if (!productSupplierIds || productSupplierIds.length === 0) {
      setProductSuppliers([]);
      return;
    }
    try {
      const promises = productSupplierIds.map((id) =>
        fetch(`http://localhost:8020/api/v1/product-suppliers/${id}`, {
          headers: { Accept: '*/*' },
        }).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      setProductSuppliers(results.map((res) => res.data || {}).filter(Boolean));
    } catch (error) {
      console.error('Error fetching product suppliers:', error);
      setProductSuppliers([]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
  }, []);

  // Xử lý phân trang và sắp xếp
  const handleTableChange = (pagination, filters, sorter) => {
    fetchSuppliers(
      pagination.current,
      pagination.pageSize,
      sorter.field || 'name',
      sorter.order === 'descend' ? 'desc' : 'asc'
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    fetchSuppliers(1, pagination.pageSize, 'name', 'asc');
  };

  // Xử lý lọc kho
  const handleWarehouseFilter = (value) => {
    setWarehouseFilter(value);
    fetchSuppliers(1, pagination.pageSize, 'name', 'asc');
  };

  // Xử lý xem chi tiết
  const handleViewDetails = async (record) => {
    setLoading(true);
    setSelectedSupplier(record);
    try {
      await Promise.all([
        fetchTransactions(record.transactionIds || []),
        fetchProductSuppliers(record.productSupplierIds || []),
      ]);
      setModalVisible(true);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột bảng
  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      sorter: true,
      width: 80,
      render: (id) => <Badge count={id} style={{ backgroundColor: '#52c41a' }} />
    },
    { 
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Tên nhà cung cấp
        </span>
      ), 
      dataIndex: 'name', 
      sorter: true,
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ backgroundColor: '#1890ff', marginRight: 12 }} 
            icon={<ShopOutlined />} 
            size="small"
          />
          <span style={{ fontWeight: 600, color: '#262626' }}>{name}</span>
        </div>
      )
    },
    { 
      title: (
        <span>
          <HomeOutlined style={{ marginRight: 8 }} />
          Địa chỉ
        </span>
      ), 
      dataIndex: 'address',
      render: (address) => (
        <Tooltip title={address}>
          <span style={{ color: '#595959' }}>
            {address && address.length > 30 ? `${address.substring(0, 30)}...` : address}
          </span>
        </Tooltip>
      )
    },
    { 
      title: (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          Số liên hệ
        </span>
      ), 
      dataIndex: 'contactNumber',
      render: (phone) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {phone}
        </Tag>
      )
    },
    {
      title: (
        <span>
          <HomeOutlined style={{ marginRight: 8 }} />
          Kho
        </span>
      ),
      dataIndex: 'warehouseId',
      render: (warehouseId) => (
        <Tag color="geekblue" style={{ fontWeight: 500 }}>
          {warehouseNames[warehouseId] || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: (
        <span>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Số sản phẩm
        </span>
      ),
      dataIndex: 'productSupplierIds',
      render: (ids) => (
        <Badge 
          count={ids ? ids.length : 0} 
          style={{ backgroundColor: '#fa8c16' }}
          showZero
        />
      ),
    },
    {
      title: (
        <span>
          <TransactionOutlined style={{ marginRight: 8 }} />
          Số giao dịch
        </span>
      ),
      dataIndex: 'transactionIds',
      render: (ids) => (
        <Badge 
          count={ids ? ids.length : 0} 
          style={{ backgroundColor: '#52c41a' }}
          showZero
        />
      ),
    },
    {
      title: 'Thao tác',
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)} 
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px'
    }}>
      <Card 
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          margin: '-24px -24px 24px -24px',
          padding: '32px 24px',
          borderRadius: '16px 16px 0 0',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                margin: 0,
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ShopOutlined style={{ marginRight: 16, fontSize: '32px' }} />
                Quản lý nhà cung cấp
              </h1>
              <p style={{ margin: '8px 0 0 48px', opacity: 0.9, fontSize: '16px' }}>
                Quản lý thông tin các nhà cung cấp và giao dịch
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng nhà cung cấp</span>}
                value={pagination.total}
                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 700 }}
              />
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} md={16} lg={12}>
            <Input.Search
              placeholder="🔍 Tìm kiếm theo tên nhà cung cấp..."
              onSearch={handleSearch}
              size="large"
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Select
              placeholder="🏪 Lọc theo kho"
              onChange={handleWarehouseFilter}
              size="large"
              style={{
                width: '100%',
                borderRadius: '12px'
              }}
              allowClear
              suffixIcon={<FilterOutlined style={{ color: '#1890ff' }} />}
            >
              {warehouses.map((warehouse) => (
                <Option key={warehouse.id} value={warehouse.id}>
                  <HomeOutlined style={{ marginRight: 8 }} />
                  {warehouse.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={suppliers}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} nhà cung cấp`,
            style: { marginTop: 16 }
          }}
          onChange={handleTableChange}
          rowKey="id"
          style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>

      {/* Modal */}
      <Modal
        title={
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '-24px -24px 24px -24px',
            padding: '20px 24px',
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ShopOutlined style={{ marginRight: 12, fontSize: '20px' }} />
            Chi tiết nhà cung cấp
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ 
          maxHeight: '80vh', 
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : selectedSupplier ? (
          <div style={{ padding: '8px' }}>
            {/* Supplier Info Card */}
            <Card 
              style={{ 
                marginBottom: 24, 
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                background: 'white'
              }}
            >
              <Descriptions 
                title={
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#262626',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Thông tin nhà cung cấp
                  </span>
                } 
                bordered
                column={{ xs: 1, sm: 1, md: 2 }}
                size="middle"
              >
                <Descriptions.Item 
                  label={
                    <span>
                      <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                      Tên
                    </span>
                  }
                >
                  <span style={{ fontWeight: 600, color: '#262626' }}>
                    {selectedSupplier.name}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <span>
                      <HomeOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      Địa chỉ
                    </span>
                  }
                >
                  {selectedSupplier.address}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <span>
                      <PhoneOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                      Số liên hệ
                    </span>
                  }
                >
                  <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                    {selectedSupplier.contactNumber}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <span>
                      <HomeOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                      Kho
                    </span>
                  }
                >
                  <Tag color="geekblue" style={{ fontWeight: 500 }}>
                    {warehouseNames[selectedSupplier.warehouseId] || 'Unknown'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Transactions Card */}
            <Card 
              title={
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#262626',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <TransactionOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  Danh sách giao dịch ({transactions.length})
                </span>
              }
              style={{ 
                marginBottom: 24, 
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                background: 'white'
              }}
            >
              <Table
                columns={[
                  { 
                    title: 'ID', 
                    dataIndex: 'id',
                    render: (id) => <Badge count={id} style={{ backgroundColor: '#52c41a' }} />
                  },
                  { 
                    title: (
                      <span>
                        <NumberOutlined style={{ marginRight: 8 }} />
                        Số lượng
                      </span>
                    ), 
                    dataIndex: 'quantity',
                    render: (quantity) => (
                      <Tag color="orange" style={{ fontWeight: 500 }}>
                        {quantity || 0}
                      </Tag>
                    )
                  },
                  { 
                    title: 'Loại', 
                    dataIndex: 'type',
                    render: (type) => (
                      <Tag color={type === 'IMPORT' ? 'green' : 'red'}>
                        {type}
                      </Tag>
                    )
                  },
                  { 
                    title: 'Trạng thái', 
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag color={status === 'COMPLETED' ? 'success' : 'processing'}>
                        {status}
                      </Tag>
                    )
                  },
                  { 
                    title: (
                      <span>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Ngày giao dịch
                      </span>
                    ), 
                    dataIndex: 'transactionDate',
                    render: (date) => (
                      <Tag color="blue">
                        {date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}
                      </Tag>
                    )
                  },
                ]}
                dataSource={transactions}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                size="small"
              />
            </Card>

            {/* Product Suppliers Card */}
            <Card 
              title={
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#262626',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <ShoppingCartOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                  Danh sách sản phẩm cung cấp ({productSuppliers.length})
                </span>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                background: 'white'
              }}
            >
              <Table
                columns={[
                  { 
                    title: 'ID', 
                    dataIndex: 'id',
                    render: (id) => <Badge count={id} style={{ backgroundColor: '#fa8c16' }} />
                  },
                  { 
                    title: 'Sản phẩm ID', 
                    dataIndex: 'productId',
                    render: (productId) => (
                      <Tag color="purple">#{productId}</Tag>
                    )
                  },
                  { 
                    title: (
                      <span>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Ngày cung cấp
                      </span>
                    ), 
                    dataIndex: 'supplyDate',
                    render: (date) => (
                      <Tag color="cyan">
                        {date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}
                      </Tag>
                    )
                  },
                  { 
                    title: (
                      <span>
                        <DollarOutlined style={{ marginRight: 8 }} />
                        Giá cung cấp
                      </span>
                    ), 
                    dataIndex: 'supplyPrice',
                    render: (price) => (
                      <Tag color="gold" style={{ fontWeight: 600 }}>
                        {price ? `${price.toLocaleString('vi-VN')} ₫` : 'N/A'}
                      </Tag>
                    )
                  },
                  { 
                    title: (
                      <span>
                        <NumberOutlined style={{ marginRight: 8 }} />
                        Số lượng
                      </span>
                    ), 
                    dataIndex: 'supplyQuantity',
                    render: (quantity) => (
                      <Badge count={quantity || 0} style={{ backgroundColor: '#1890ff' }} />
                    )
                  },
                ]}
                dataSource={productSuppliers}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                size="small"
              />
            </Card>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#8c8c8c',
            fontSize: '16px'
          }}>
            Không có dữ liệu
          </div>
        )}
      </Modal>

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa !important;
        }
        .table-row-dark {
          background-color: #ffffff !important;
        }
        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default SuppliersManagement;