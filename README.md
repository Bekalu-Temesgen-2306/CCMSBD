# Campus Clearance Management System (CCMS)

A comprehensive web-based system for managing student clearance processes at Bahir Dar University. Built with React, Bootstrap, and modern web technologies.

## 🎯 Features

### For Students
- **Digital Clearance Requests**: Submit clearance requests online
- **Real-time Status Tracking**: Monitor clearance request status
- **PDF Certificate Generation**: Download clearance certificates
- **User-friendly Interface**: Easy-to-use forms with auto-fill capabilities

### For Department Officials
- **Risk Management**: Add and manage students at risk
- **Status Updates**: Mark risks as resolved
- **Student Search**: Find and manage student records
- **Department-specific Views**: Filter by department

### For Main Administrators
- **System Overview**: Dashboard with key metrics
- **Official Management**: Add/edit department officials
- **Risk Monitoring**: View all students at risk across departments
- **Data Export**: Export data to CSV and Excel formats

## 🚀 Technology Stack

- **Frontend**: React 18, Vite
- **UI Framework**: React Bootstrap, Bootstrap 5
- **Icons**: React Bootstrap Icons, React Icons
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Data Export**: XLSX
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, PostCSS

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd CCMSBD
   ```

2. **Install dependencies**
   ```bash
   cd ccms-frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 👥 User Roles & Access

### Student Login
- **Username**: `stu001` to `stu010`
- **Password**: `pass123`
- **Access**: Clearance dashboard, request submission

### Department Official Login
- **Username**: Various official usernames
- **Password**: `pass123`
- **Access**: Risk management, student oversight

### Main Administrator Login
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: System administration, user management

## 📁 Project Structure

```
CCMSBD/
├── ccms-frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Main page components
│   │   ├── data/               # Mock data files
│   │   ├── assets/             # Images and static files
│   │   └── styles/             # CSS and styling
│   ├── public/                 # Public assets
│   └── package.json            # Dependencies and scripts
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Key Features Implemented

### Recent Updates
- ✅ **Sex field auto-fill** from database
- ✅ **Academic year, semester, year of study** editable by students
- ✅ **Risk status management** with "atRisk" and "resolved" states
- ✅ **Status visibility fixes** in official dashboard
- ✅ **Form validation** for all required fields

### Core Functionality
- ✅ **Multi-role authentication system**
- ✅ **Student clearance request workflow**
- ✅ **Risk management for officials**
- ✅ **PDF certificate generation**
- ✅ **Data export capabilities**
- ✅ **Responsive design**

## 🔒 Security Features

- Role-based access control
- Form validation and sanitization
- Secure authentication flow
- Data persistence with localStorage

## 📊 Data Management

The system uses mock data for demonstration purposes:
- `mockStudentData.json` - Student information
- `mockOfficialsData.json` - Official records
- `mockRiskData.json` - Risk management data
- `mockMainAdminData.json` - Administrator data

## 🚀 Deployment

### Build for Production
```bash
cd ccms-frontend
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development Team

- **Bahir Dar University** - Campus Clearance Management System
- **Built with React and modern web technologies**

## 📞 Support

For support and questions:
- **Email**: registrar@bdu.edu.et
- **Phone**: +251-58-220-0000

---

**© 2025 Bahir Dar University. All rights reserved.** 