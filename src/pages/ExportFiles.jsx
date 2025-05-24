import React, { useState } from 'react';
import { Button, DatePicker, Select, Space, Switch } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Nhập dayjs để xử lý giá trị từ DatePicker

const { Option } = Select;

const ExportFiles = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [format, setFormat] = useState('pdf');
  const [saveToFileSystem, setSaveToFileSystem] = useState(true);

  // Hàm định dạng ngày thành chuỗi ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  const formatDateToISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // Hàm kiểm tra ngày hợp lệ
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleExport = async () => {
    // Kiểm tra giá trị startDate và endDate
    if (!startDate || !endDate || !isValidDate(startDate) || !isValidDate(endDate)) {
      alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc hợp lệ!');
      return;
    }

    // Chuyển đổi ngày thành định dạng ISO
    const formattedStartDate = formatDateToISO(startDate);
    const formattedEndDate = formatDateToISO(endDate);

    console.log('Start Date (before API):', formattedStartDate);
    console.log('End Date (before API):', formattedEndDate);

    // Kiểm tra ngày bắt đầu không lớn hơn ngày kết thúc
    if (new Date(startDate) > new Date(endDate)) {
      alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
      return;
    }

    const apiUrl = `http://localhost:8020/api/statistics/transactions/export?startDate=${encodeURIComponent(
      formattedStartDate
    )}&endDate=${encodeURIComponent(formattedEndDate)}&format=${format}&saveToFileSystem=${saveToFileSystem}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: 'application/octet-stream',
        },
      });

      if (response.status === 200) {
        const blob = await response.blob();
        console.log('Blob size:', blob.size);

        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          fileName = fileNameMatch && fileNameMatch[1] ? fileNameMatch[1] : `transaction-statistics.${format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'}`;
        } else {
          fileName = `transaction-statistics.${format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'}`;
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Có lỗi xảy ra khi tải file!');
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      alert('Có lỗi xảy ra khi gọi API!');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Xuất Báo Cáo</h2>
        <Space direction="vertical" size="middle" className="w-full">
          {/* Field chọn ngày bắt đầu */}
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={startDate ? dayjs(startDate) : null} // Chuyển Date thành dayjs để hiển thị
            onChange={(date) => {
              const newDate = date ? date.toDate() : null; // Chuyển từ dayjs sang Date
              console.log('Selected Start Date:', newDate);
              setStartDate(newDate);
            }}
            className="w-full"
            placeholder="Từ ngày"
          />
          {/* Field chọn ngày kết thúc */}
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={endDate ? dayjs(endDate) : null} // Chuyển Date thành dayjs để hiển thị
            onChange={(date) => {
              const newDate = date ? date.toDate() : null; // Chuyển từ dayjs sang Date
              console.log('Selected End Date:', newDate);
              setEndDate(newDate);
            }}
            className="w-full"
            placeholder="Đến ngày"
          />
          {/* Chọn định dạng file */}
          <Select
            value={format}
            onChange={(value) => setFormat(value)}
            className="w-full"
            placeholder="Chọn định dạng file"
          >
            <Option value="pdf">PDF</Option>
            <Option value="csv">CSV</Option>
            <Option value="excel">XLSX</Option>
          </Select>
          {/* Tùy chọn saveToFileSystem */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Lưu file vào hệ thống:</span>
            <Switch
              checked={saveToFileSystem}
              onChange={(checked) => setSaveToFileSystem(checked)}
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
            />
          </div>
          {/* Nút Tải Xuống */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Tải Xuống
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ExportFiles;