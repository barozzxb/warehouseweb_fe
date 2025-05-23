import { Form, Input, InputNumber, Select, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function ExportProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Here you would typically make an API call to process the export
    console.log('Export values:', values);
    message.success('Product exported successfully!');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Export Product" className="shadow-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: 'Please select a product!' }]}
          >
            <Select placeholder="Select product">
              <Option value="1">Product 1</Option>
              <Option value="2">Product 2</Option>
              <Option value="3">Product 3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please input quantity!' }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="destination"
            label="Destination"
            rules={[{ required: true, message: 'Please input destination!' }]}
          >
            <Input placeholder="Enter destination" />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Export Reason"
            rules={[{ required: true, message: 'Please select a reason!' }]}
          >
            <Select placeholder="Select reason">
              <Option value="sale">Sale</Option>
              <Option value="transfer">Transfer</Option>
              <Option value="return">Return</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={4} placeholder="Enter any additional notes" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-4">
              <Button onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Export Product
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ExportProduct; 