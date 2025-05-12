# Warehouse Management Web Application

## Project Overview
A web application for managing warehouse inventory, built for the Software Design Patterns course. It enables product management, stock tracking, order handling, and report generation, implementing design patterns for maintainability and scalability.

## Team Members
- **Xuân Bảo**: Project Lead, Frontend Developer (ReactJS, Ant Design)
- **Thành Đạt**: UI/UX Designer, Frontend Developer (TailwindCSS)
- **Minh Văn**: Documentation, Testing, Component Development
- **Công Chiến**: Documentation, Testing, Component Development

## Technologies Used
- **Frontend**: ReactJS, TailwindCSS, Ant Design
- **Build Tool**: Vite
- **Version Control**: Git, GitHub
- **Design Patterns**: Singleton, Factory, Observer, MVC

## Features
- **Inventory Management**: Add, update, delete, and view products.
- **Order Tracking**: Create and manage orders, track status.
- **Reports**: Generate stock and order reports.
- **User Authentication**: Login and role-based access.
- **Responsive Design**: Optimized for desktop and mobile.

## Project Structure
```
warehouseweb_fe/
├── public/                   # Static assets
├── src/                      # Source code
│   ├── assets/               # Images, fonts
│   ├── components/           # Reusable components
│   │   ├── ui/               # Button, Input, etc.
│   │   ├── section/          # Section components
│   ├── pages/                # Page components (Home, Inventory, Orders)
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   ├── index.css             # TailwindCSS styles
│   ├── main.jsx              # Entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
├── README.md                 # Project documentation
```

## Design Patterns Implemented
- **Singleton**: Ensures a single instance of the API service.
- **Factory**: Creates different types of form components dynamically.
- **Observer**: Updates UI components when data changes (e.g., stock levels).
- **MVC**: Separates concerns between data (Model), UI (View), and logic (Controller).

## Prerequisites
- Node.js (>= 16.x)
- npm (>= 8.x)
- Git

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/barozzxb/warehouseweb_fe.git
   cd warehouseweb_fe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application:
   Navigate to `http://localhost:5173` in your browser.

## Usage
- **Login**: Use predefined credentials or register a new account.
- **Manage Inventory**: Add or update products via the Inventory page.
- **Track Orders**: Create and monitor orders on the Orders page.
- **View Reports**: Access stock and order reports from the Dashboard.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License
This project is licensed under the MIT License.

## Contact
For inquiries, contact the team lead at: [dathiichan141@gmail.com](mailto:dathiichan141@gmail.com).
