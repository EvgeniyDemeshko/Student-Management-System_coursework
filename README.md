Student Management System
Overview
This project is a course work titled "Development of an Information System for Student Management Using Angular and Node.js." It aims to create a robust and efficient system for managing student data within a university's dean office. The system leverages modern web development technologies and a PostgreSQL database to automate and streamline student data management.
Features

<img width="602" height="306" alt="зображення_2025-07-23_054154584" src="https://github.com/user-attachments/assets/bc712b31-a2bc-4dd6-9749-9c6816284275" />

Student Data Management: Store and manage information about students, including personal details, academic groups, specialties, departments, and grades.
Database Operations: Perform CRUD (Create, Read, Update, Delete) operations on student-related data using SQL queries in PostgreSQL.
Web Interface: A user-friendly client-side application built with Angular, allowing users to view, add, edit, and delete student records, as well as generate performance reports.
Server-Side Logic: A Node.js server with Express.js handles API requests, processes SQL queries, and communicates with the PostgreSQL database.
Reporting: Generate reports such as student rankings based on average grades and lists of students with grades below a certain threshold (e.g., 60).

Technologies Used

PostgreSQL: A powerful open-source relational database management system used for storing and managing student data.
Angular: A front-end framework for building the client-side web interface, providing a dynamic and responsive user experience.
Node.js: A server-side runtime environment for handling API requests and database interactions.
Express.js: A Node.js framework for creating a robust server-side API.
SQL: Used for creating, querying, and managing the database schema and data.

Project Structure

Database: The PostgreSQL database schema includes tables for departments, specialties, student groups, students, teachers, subjects, and grades. Relationships between entities are defined with foreign keys to ensure data integrity.
Client-Side: The Angular application provides components for displaying student lists, personal profiles, and generating reports. It interacts with the server via HTTP requests.
Server-Side: The Node.js server with the Express.js framework handles HTTP requests, processes SQL queries, and returns JSON responses to the client.
Diagrams: The project includes UML diagrams (e.g., class diagrams, use case diagrams) to illustrate the system’s architecture and data relationships.

<img width="622" height="358" alt="зображення_2025-07-23_054247469" src="https://github.com/user-attachments/assets/19cf1a73-c287-41b6-90e0-7db3165e0a1a" />

Installation

Prerequisites:

Install PostgreSQL and pgAdmin for database management.
Install Node.js for the server-side environment.
Install Angular CLI for the client-side application.


Database Setup:

Create a new database in PostgreSQL using pgAdmin or the CREATE DATABASE command.
Execute the SQL scripts provided in the repository to create tables and define relationships (e.g., department, specialty, students_group, etc.).
Populate the database with initial data using INSERT INTO queries.


Server Setup:

Clone the repository: git clone https://github.com/EvgeniyDemeshko/cursodwork.git
Navigate to the server directory: cd cursodwork/server
Install dependencies: npm install
Configure the database connection in the Node.js application (e.g., update the connection string in the configuration file).
Start the server: npm start


Client Setup:

Navigate to the client directory: cd cursodwork/client
Install dependencies: npm install
Start the Angular application: ng serve
Access the application at http://localhost:4200.



Usage

Main Page: Displays a table of all students with options to filter, sort, or view detailed information.
Student Profile: View detailed information about a specific student by clicking the "Details" button.
Reports: Generate performance reports, such as student rankings or lists of students with grades below 60, via the reporting section.
CRUD Operations: Add, edit, or delete student records through the web interface, with changes reflected in the PostgreSQL database.

Future Improvements

Authentication: Implement user authentication to secure access to the system.
Additional Attributes: Add support for tracking students’ academic levels or other relevant data.
Enhanced Reporting: Expand reporting capabilities to include more complex analytics and visualizations.


Author

Evgeniy Demeshko: Developer of the course work project.
