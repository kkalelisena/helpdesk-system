🎫 Helpdesk & Ticket Management System
This is a Full-Stack Management System developed for corporate needs, enabling users to create support tickets and allowing administrators to filter and respond to these requests efficiently.

✨ Key Features
Role-Based Access Control (RBAC): Customized dashboards and authorization for Admin and Customer roles.

Smart Ticket Management: Dynamic filtering of requests based on status (Open/Closed) and priority levels (Low, Medium, High).

Automated Email Notifications (SMTP): Automatic email delivery using JavaMailSender for password resets and ticket updates.

Customer Satisfaction Analysis (CSAT): An interactive feedback system where customers can rate the service (1-5 stars) after ticket resolution.

Enhanced Security & UI: Real-time password strength analysis, responsive (mobile-friendly) modern interface, and user-centric navigation.

🛠️ Tech Stack
Frontend: React.js, Bootstrap 5, Axios, React Router

Backend: Java 17, Spring Boot 3, Spring Data JPA

Database: MySQL (Relational architecture with Foreign Key management)

Communication: RESTful API & SMTP Protocol

📊 Database Architecture
The system is built on a structured ER Diagram managing relationships between users, tickets, and feedback entities.

🚀 Installation & Setup
Backend
Update your MySQL credentials in src/main/resources/application.properties.

Build and run the project using Maven.

Frontend
Navigate to the frontend directory and run npm install to install dependencies.

Launch the application with npm start.
