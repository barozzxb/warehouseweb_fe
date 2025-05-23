import { Form, Input, InputNumber, Select, Button, Card, message, Row, Col, Steps, Divider, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, BarcodeOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

const { Option } = Select;

function ImportProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'http://localhost:8020/api/v1/categories?page=1&size=100&sort=name&direction=asc',
        { headers: { 'Accept': '*/*' } }
      );
      const result = await response.json();
      if (result.status === 200) {
        setCategories(result.data.content);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories');
    }
  };

  // Fetch inventories
  const fetchInventories = async () => {
    try {
      const response = await fetch('http://localhost:8020/api/v1/inventories', {
        headers: { 'Accept': '*/*' },
      });
      const result = await response.json();
      if (result.status === 200) {
        setInventories(result.data.content || result.data);
      }
    } catch (error) {
      console.error('Error fetching inventories:', error);
      message.error('Failed to load inventories');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchInventories();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        quantity: values.quantity,
        unitPrice: values.unitPrice,
        location: values.location,
        entryDate: values.entryDate
          ? moment(values.entryDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          : undefined,
        expiryDate: values.expiryDate
          ? moment(values.expiryDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          : undefined,
        categoryId: values.categoryId,
        inventoryId: values.inventoryId,
      };

      const response = await fetch('http://localhost:8020/api/v1/products', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === 201) {
        message.success('Product imported successfully!');
        navigate('/');
      } else {
        message.error(result.message || 'Failed to import product');
        console.error('Error importing product:', result);
      }
    } catch (error) {
      console.error('Error importing product:', error);
      message.error('Failed to import product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm" bordered={false}>
          <div className="mb-6">
            <Steps
              current={0}
              items={[
                { title: 'Nhập thông tin', icon: <AppstoreAddOutlined /> },
                { title: 'Xác nhận', icon: <InboxOutlined /> },
                { title: 'Hoàn thành', icon: <BarcodeOutlined /> },
              ]}
            />
          </div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-blue-700">
            <AppstoreAddOutlined /> Nhập sản phẩm vào kho
          </h2>
          <Divider orientation="left">Thông tin sản phẩm</Divider>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className=""
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="categoryId"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select placeholder="Chọn danh mục" loading={!categories.length}>
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="inventoryId"
                  label="Kho"
                  rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
                >
                  <Select placeholder="Chọn kho" loading={!inventories.length}>
                    {inventories.map((inventory) => (
                      <Option key={inventory.id} value={inventory.id}>
                        {inventory.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Vị trí lưu trữ"
                  rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
                >
                  <Input placeholder="Nhập vị trí (VD: L-12-03)" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Thông tin nhập kho</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="quantity"
                  label="Số lượng nhập"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                  <InputNumber min={1} className="w-full" placeholder="Số lượng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unitPrice"
                  label="Giá nhập (VNĐ)"
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber
                    min={0}
                    step={1000}
                    className="w-full"
                    placeholder="Giá nhập"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="entryDate"
                  label="Ngày nhập kho"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày nhập!' }]}
                >
                  <DatePicker
                    className="w-full"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Chọn ngày nhập"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="expiryDate"
                  label="Ngày hết hạn"
                >
                  <DatePicker
                    className="w-full"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Chọn ngày hết hạn"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate('/')} disabled={loading}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
                >
                  Xác nhận nhập kho
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ImportProduct;