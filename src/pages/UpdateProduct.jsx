import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Card, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const UpdateProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();

  // Lấy dữ liệu sản phẩm dựa trên ID
  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8020/api/v1/products/${id}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.status === 200) {
        const product = data.data;
        // Xử lý định dạng ngày giờ trước khi điền vào form
        const entryDate = moment(product.entryDate, moment.ISO_8601);
        const expiryDate = moment(product.expiryDate, moment.ISO_8601);

        // Điền dữ liệu vào form
        form.setFieldsValue({
          name: product.name,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
          location: product.location,
          entryDate: entryDate.isValid() ? entryDate : null,
          expiryDate: expiryDate.isValid() ? expiryDate : null,
          categoryId: product.categoryId,
          inventoryId: product.inventoryId,
        });
      } else {
        message.error(data.message || 'Lấy thông tin sản phẩm thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy thông tin sản phẩm!');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Gửi yêu cầu cập nhật sản phẩm
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8020/api/v1/products/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: values.name,
          quantity: values.quantity,
          unitPrice: values.unitPrice,
          location: values.location,
          entryDate: values.entryDate ? values.entryDate.toISOString() : null,
          expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
          categoryId: values.categoryId,
          inventoryId: values.inventoryId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 200) {
        message.success(data.message || 'Cập nhật sản phẩm thành công!');
        navigate('/'); // Quay lại trang ProductList sau khi cập nhật
      } else {
        message.error(data.message || 'Cập nhật sản phẩm thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  // Danh sách danh mục (mocked)
  const categories = [
    { id: 2, name: 'Electronics' },
    { id: 6, name: 'Clothing' },
    { id: 7, name: 'Clothing' },
    { id: 8, name: 'Furniture' },
    { id: 12, name: 'Automotive' },
    { id: 13, name: 'Stationery' },
    { id: 14, name: 'Food' },
    { id: 18, name: 'Medical' },
  ];

  // Danh sách kho (mocked)
  const inventories = [
    { id: 1, name: 'Warehouse A' },
    { id: 9, name: 'Warehouse B' },
    { id: 10, name: 'Warehouse C' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <Title level={2} className="text-center mb-6">
          Cập nhật sản phẩm
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <Input type="number" placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item
            name="unitPrice"
            label="Đơn giá"
            rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
          >
            <Input type="number" placeholder="Nhập đơn giá" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
          >
            <Input placeholder="Nhập vị trí" />
          </Form.Item>

          <Form.Item
            name="entryDate"
            label="Ngày nhập kho"
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhập kho!' }]}
          >
            <DatePicker
              showTime
              className="w-full"
              placeholder="Chọn ngày nhập kho"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="Ngày hết hạn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
          >
            <DatePicker
              showTime
              className="w-full"
              placeholder="Chọn ngày hết hạn"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="inventoryId"
            label="Kho"
            rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
          >
            <Select placeholder="Chọn kho">
              {inventories.map((inventory) => (
                <Option key={inventory.id} value={inventory.id}>
                  {inventory.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => navigate('/')} className="border-gray-300">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500 hover:bg-blue-600">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProduct;