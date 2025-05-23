import { Form, Input, InputNumber, Select, Button, Card, message, Row, Col, Steps, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, BarcodeOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const { Option } = Select;

function ImportProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Here you would typically make an API call to save the product
    console.log('Received values:', values);
    message.success('Product imported successfully!');
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg" bordered={false}>
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
                name="sku"
                label="Mã SKU"
                rules={[{ required: true, message: 'Vui lòng nhập SKU!' }]}
              >
                <Input placeholder="Nhập mã SKU" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Option value="electronics">Điện tử</Option>
                  <Option value="clothing">Thời trang</Option>
                  <Option value="furniture">Nội thất</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Mô tả"
              >
                <Input.TextArea rows={1} placeholder="Mô tả sản phẩm" />
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
                name="price"
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

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-end space-x-4">
              <Button onClick={() => navigate('/')}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Xác nhận nhập kho
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ImportProduct; 