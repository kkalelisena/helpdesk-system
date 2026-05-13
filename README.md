# 🎫 Helpdesk & Ticket Management System

This is a **Full-Stack Management System** developed for corporate needs, enabling users to create support tickets and allowing administrators to filter and respond to these requests efficiently.

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Customized dashboards and authorization for Admin and Customer roles.
* **Smart Ticket Management:** Dynamic filtering of requests based on status (Open/Closed) and priority levels (Low, Medium, High).
* **Automated Email Notifications (SMTP):** Automatic email delivery using **JavaMailSender** for password resets and ticket updates.
* **Customer Satisfaction Analysis (CSAT):** An interactive feedback system where customers can rate the service (1-5 stars) after ticket resolution.
* **Enhanced Security & UI:** Real-time password strength analysis, responsive (mobile-friendly) modern interface, and user-centric navigation.

---

## 🛠️ Tech Stack

### **Frontend**
* **Library:** React.js
* **Styling:** Bootstrap 5 (CSS3)
* **Networking:** Axios (REST API Communication)
* **Routing:** React Router

### **Backend**
* **Framework:** Java 17, Spring Boot 3
* **Data Access:** Spring Data JPA
* **Email Engine:** JavaMailSender (SMTP Protocol)

### **Database**
* **System:** MySQL
* **Architecture:** Relational database with Foreign Key management.

---

## 📊 Database Architecture

The system is built on a structured **ER Diagram** managing relationships between users, tickets, and feedback entities.

---

## 🚀 Installation & Setup

### 1. Backend Setup
1. Navigate to the backend directory.
2. Update your MySQL credentials in `src/main/resources/application.properties`.
3. Build and run the project using **Maven**.

### 2. Frontend Setup
1. Navigate to the frontend directory.
2. Run `npm install` to install required dependencies.
3. Launch the application with `npm start`.

---

## 👥 Contributors
* **Sena Kaleli**
