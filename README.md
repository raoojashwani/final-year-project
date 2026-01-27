# C&O Group – Smart Multi-Division Event Management & Client Booking Platform

## 📌 Project Overview
This project is a startup-based web application designed to digitize and streamline event management operations for corporate and government-oriented event organizations. It is developed for **C&O Group LLP**, which operates through two business divisions:
- **Thread & Knot** – Wedding and Social Events  
- **Prism Planner** – Corporate, MICE, and Government Events  

The platform provides a centralized system for managing client bookings, event packages, vendors, invoices, and operational workflows under a single digital interface.

---

## 🎯 Problem Statement
Traditional event management firms rely heavily on manual processes such as phone-based inquiries, spreadsheets, and fragmented communication channels. This leads to:
- Inefficient booking management  
- Lack of transparency  
- Difficulty in vendor coordination  
- Poor documentation and tracking  
- Limited scalability for startup-oriented businesses  

There is a need for a unified, compliance-oriented digital platform that can handle end-to-end event operations efficiently.

---

## 💡 Proposed Solution
The proposed system is a **full-stack web-based platform** that integrates:
- Client-side event exploration and booking  
- Administrative management of packages, bookings, and vendors  
- Automated invoice generation  
- QR-based event passes  
- Secure authentication and role-based access  

The solution follows a **Minimum Viable Product (MVP)** approach suitable for startup deployment and future scalability.

---

## ⚙️ Key Features
- Multi-division event management (Wedding/Social and Corporate/MICE)  
- Client inquiry and booking system  
- Centralized admin dashboard  
- Vendor management module  
- Automated invoice generation (PDF)  
- QR-based event pass generation  
- Email notifications and booking status updates  
- Secure authentication and authorization  

---

## 🧰 Technology Stack

### Frontend:
- HTML  
- CSS  
- JavaScript  

### Backend:
- Node.js  
- Express.js  

### Database:
- MongoDB  

### Authentication & Security:
- JSON Web Tokens (JWT)  
- bcrypt for password hashing  

### Cloud & Utilities:
- Cloudinary (media storage)  
- PDF generation library  
- QR code generation library  
- Nodemailer (email service)  

---

## 🏗️ Project Architecture
The system follows a modular client-server architecture:
- Client Interface → Backend API → Database  
- Admin Dashboard → Backend API  
- Backend ↔ Cloud Storage & Email Services  

Architecture diagrams and flowcharts are available in the `/diagrams` directory.

---
## 📁 Folder Structure
C-O-Group-Event-Platform/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── pages/
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
├── docs/
│   └── project_synopsis.pdf
│
├── diagrams/
│   └── architecture_diagram.png
│
├── README.md
├── .gitignore
└── .env.example
---

## 🚀 How to Run (Development Mode)

> *(Skeleton structure – functional modules will be added incrementally)*

## 1. Clone the repository
git clone https://github.com/raoojashwani/final-year-project.git
## 2. Navigate to the project directory
cd C-O-Group-Event-Platform
## 3. Install backend dependencies (when backend is implemented)
cd backend
npm install
## 4. Configure environment variables
Create a .env file using .env.example and configure the required environment variables.
## 5. Start the server
npm start

---
📊 Expected Outcomes
- Centralized event management system
- Reduced manual operations
- Improved transparency and tracking
- Scalable startup-ready MVP
- Real-world application of full-stack development

---

🔮 Future Scope
- Payment gateway integration (Razorpay / Stripe)
- Mobile application support
- AI-based event planning assistance
- Analytics dashboard for business insights
- Multi-language support
- Role-based vendor portals
---

👥 Team Members
- Ojashwani Rao – Team Leader
(Backend, Architecture, Business Logic, Documentation)

- Vidhit Madaan – Frontend Developer
(UI Design, Testing Support)

---

📜 License
This project is developed as part of the Final Year Major Project under the Startup category and is intended for academic and research purposes.

---

📬 Contact
For queries or collaboration:

- Email: 2301201216@krmu.edu.in
- Institution: K.R. Mangalam University, Gurugram

© 2026 C&O Group – Smart Event Management Platform
