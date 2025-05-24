import React, { useState } from 'react';
import { Button, DatePicker, Select, Space, Switch } from 'antd';
import { DownloadOutlined, CalendarOutlined, FileTextOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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

  const getFormatIcon = (formatType) => {
    switch (formatType) {
      case 'pdf':
        return '📄';
      case 'csv':
        return '📊';
      case 'excel':
        return '📋';
      default:
        return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex justify-center items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <CloudDownloadOutlined className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Xuất Báo Cáo
          </h2>
          <p className="text-gray-500 text-sm">Tạo và tải xuống báo cáo giao dịch</p>
        </div>

        <Space direction="vertical" size="large" className="w-full">
          {/* Date Range Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarOutlined className="text-blue-500" />
              <span className="font-semibold text-gray-700">Khoảng thời gian</span>
            </div>
            
            {/* Start Date */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-600 mb-2">Từ ngày</label>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={startDate ? dayjs(startDate) : null}
                onChange={(date) => {
                  const newDate = date ? date.toDate() : null;
                  console.log('Selected Start Date:', newDate);
                  setStartDate(newDate);
                }}
                className="w-full h-12 rounded-lg border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Chọn ngày bắt đầu"
              />
            </div>

            {/* End Date */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-600 mb-2">Đến ngày</label>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={endDate ? dayjs(endDate) : null}
                onChange={(date) => {
                  const newDate = date ? date.toDate() : null;
                  console.log('Selected End Date:', newDate);
                  setEndDate(newDate);
                }}
                className="w-full h-12 rounded-lg border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Chọn ngày kết thúc"
              />
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-purple-500" />
              <span className="font-semibold text-gray-700">Định dạng file</span>
            </div>
            <Select
              value={format}
              onChange={(value) => setFormat(value)}
              className="w-full"
              placeholder="Chọn định dạng file"
              size="large"
            >
              <Option value="pdf">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <span>PDF Document</span>
                </div>
              </Option>
              <Option value="csv">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span>CSV Spreadsheet</span>
                </div>
              </Option>
              <Option value="excel">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <span>Excel Workbook</span>
                </div>
              </Option>
            </Select>
          </div>

          {/* Save to FileSystem Toggle */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💾</span>
                <div>
                  <span className="font-medium text-gray-700">Lưu file vào hệ thống</span>
                  <p className="text-xs text-gray-500 mt-1">Tự động lưu bản sao vào server</p>
                </div>
              </div>
              <Switch
                checked={saveToFileSystem}
                onChange={(checked) => setSaveToFileSystem(checked)}
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                className="bg-gray-300"
              />
            </div>
          </div>

          {/* Export Button */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="large"
            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">{getFormatIcon(format)}</span>
              Tải Xuống Báo Cáo
            </span>
          </Button>

          {/* Info footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Báo cáo sẽ được tạo theo khoảng thời gian đã chọn
            </p>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default ExportFiles;