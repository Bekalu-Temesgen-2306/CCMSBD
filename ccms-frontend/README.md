# Campus Clearance Management System (CCMS)

A comprehensive digital solution for Bahir Dar University to replace manual clearance processes with an efficient, transparent, and accessible system.

## 🎯 Project Overview

The CCMS digitizes the entire clearance workflow, making it faster, more transparent, and easily accessible for students and university staff. It eliminates long queues and inefficiencies associated with manual processes.

## ✨ Key Features

### 🎓 Student Features
- **Digital Clearance Request**: Students can initiate clearance requests through a user-friendly form
- **Auto-filled Student Data**: Form automatically populates with student information from database
- **Real-time Status Tracking**: View clearance status and progress
- **PDF Certificate Generation**: Download digitally signed clearance certificates
- **Mobile Responsive**: Works seamlessly on all devices

### 👨‍💼 Department Official Features
- **Student Selection Interface**: Select students from existing database instead of manual entry
- **Risk Management**: Add students to risk tables with detailed case descriptions
- **Search & Filter**: Find students quickly by name, ID, or department
- **Real-time Updates**: Immediate updates to risk tables

### 🔧 Admin Features
- **Department Official Management**: Add, edit, and manage department officials
- **System Overview**: View all students in risk tables across departments
- **Role-based Access Control**: Secure access based on user roles
- **Data Export**: Export officials and risk data to CSV and Excel formats

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CCMSBD/ccms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Login Credentials

### Students
- **Username**: `stu001` | **Password**: `pass123`
- **Username**: `stu002` | **Password**: `pass123`
- (and more in mock data)

### Department Officials
- **Library**: `abebe.library` | **Password**: `library123`
- **Sports**: `almaz.sports` | **Password**: `sports123`
- **Dormitory**: `bereket.dorm` | **Password**: `dorm123`
- **Registrar**: `eden.registrar` | **Password**: `reg123`

### Main Admin
- **Username**: `samuel.admin` | **Password**: `admin123`

## 📋 User Workflows

### Student Clearance Process
1. **Login** with student credentials
2. **Click "Clearance Request"** button
3. **Review auto-filled information** (student name, ID, department, etc.)
4. **Complete remaining fields** (father's name, grandfather's name, reason for clearance)
5. **Submit** the request
6. **Wait for verification** and risk checks
7. **Download clearance certificate** if approved

### Department Official Process
1. **Login** with official credentials
2. **Click "Add Student to Risk"** button
3. **Search and select** a student from the database
4. **Enter risk case description**
5. **Submit** to add student to risk table
6. **Manage existing risk entries** (edit/delete)

### Admin Process
1. **Login** with admin credentials
2. **Manage department officials** (add/edit/delete)
3. **View all risk tables** across departments
4. **Export data** to CSV or Excel format
5. **Monitor system activity**

## 🛠️ Technical Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: React Bootstrap + Bootstrap 5
- **Icons**: React Bootstrap Icons + React Icons
- **Routing**: React Router DOM
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS + Bootstrap

## 📁 Project Structure

```
ccms-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── data/               # Mock data files
│   ├── assets/             # Images and static files
│   ├── styles/             # CSS and styling files
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔄 Recent Updates

### Student Selection Interface (Latest)
- **Replaced manual form entry** with student selection from database
- **Added search and filter functionality** for easy student discovery
- **Improved user experience** with visual student cards
- **Prevented duplicate entries** with risk status indicators
- **Enhanced data consistency** by using existing student records

### Bug Fixes (Latest)
- **Fixed "Added By" field**: Now correctly displays the logged-in official's name instead of "Official"
- **Improved user identification**: Proper display of official names in headers and risk entries
- **Enhanced data consistency**: Updated mock risk data to match student database structure

### Excel Export Feature (Latest)
- **Added Excel export functionality**: Export officials and risk data to Excel format
- **Dual export options**: Both CSV and Excel export buttons available in admin dashboard
- **Professional formatting**: Clean Excel files with proper headers and data structure

### Student Form Auto-fill (Latest)
- **Auto-populated student data**: Form automatically fills student information from database
- **Reduced manual entry**: Students only need to fill dynamic fields (family names, reason, date)
- **Visual indicators**: Clear distinction between auto-filled and user-input fields
- **Improved user experience**: Faster form completion with fewer errors

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Screen reader friendly with keyboard navigation
- **Progress Indicators**: Visual feedback during operations
- **Error Handling**: Clear error messages and validation
- **Loading States**: Smooth user experience with loading indicators

## 🔒 Security Features

- **Role-based Access Control**: Different interfaces for different user types
- **Session Management**: Secure login/logout functionality
- **Data Validation**: Input validation and sanitization
- **Protected Routes**: Automatic redirection for unauthorized access

## 📊 Data Management

- **Local Storage**: Persistent data across browser sessions
- **Mock Data**: Comprehensive test data for development
- **Data Consistency**: Structured data format across all modules
- **Export Capabilities**: PDF generation for official documents

## 🚧 Development Notes

- Currently using mock data for demonstration
- All data is stored in browser localStorage
- PDF generation includes digital signatures and university seal
- Mobile-first responsive design approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions, please contact the development team.

---

**© 2024 Bahir Dar University. All rights reserved.**
