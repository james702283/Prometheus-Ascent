# Prometheus Ascent

**An AI-powered skill intelligence platform designed to replace career fog with a clear, data-driven path forward.**

---

## The Vision

In today's tech landscape, the half-life of a technical skill is rapidly shrinking. For ambitious professionals, the career path is no longer a clear ladder; it's a dense, confusing fog. We are constantly forced to ask, "What skills should I learn next to stay relevant and advance?" while relying on generic job descriptions and gut feelings.

Simultaneously, companies spend billions on hiring and training, yet struggle to identify the real skill gaps in their teams.

**Prometheus Ascent** is the solution. It is a personalized career co-pilot that leverages AI to provide a clear, data-driven path forward for professionals and unprecedented skill clarity for organizations.

---

## Core Features (Current Iteration)

This version of the platform establishes the foundational user journey and the core AI feedback loop.

*   **Secure User Authentication:** A robust authentication system allows users to register and log in securely. Sessions are managed using JSON Web Tokens (JWT) for secure communication between the frontend and backend.

*   **Expert-Level Self-Assessment:** Users can select from an expanding list of professional verticals, starting with **Modern Software Engineering**. The assessment covers a detailed, expert-level taxonomy, allowing users to accurately rate their proficiency across a wide range of relevant skills.

*   **AI-Powered Career Analysis:** The "Analyst AI" is the core of the user-facing value proposition. With a single click, a user's anonymized skill profile is sent to the Google Gemini API, which performs a deep analysis and provides:
    *   Identification of key strengths and their value in the industry.
    *   Constructive feedback on the most impactful areas for growth.
    *   Concrete, actionable recommendations for career advancement.

*   **Objective Skill Quizzes:** To move beyond self-reported data, users can enter the "Challenge Zone" from their dashboard. Here, the Analyst AI dynamically generates multiple-choice quizzes for specific skills, allowing users to validate their knowledge and receive immediate feedback on their performance.

---

## Technical Architecture

Prometheus Ascent is architected as a fully decoupled, full-stack application, ensuring scalability and modularity from day one.

### **Frontend**

*   **Framework:** A modern and responsive Single Page Application (SPA) built with **React**.
*   **Routing:** Client-side routing is handled by **React Router** for a seamless user experience with unique URLs for each view.
*   **Styling:** A professional and polished user interface styled with **Tailwind CSS**.
*   **Architecture:** The codebase is organized into a clean, component-based structure:
    *   `views/`: For page-level components.
    *   `components/`: For smaller, reusable UI elements.
    *   `services/`: For centralized API communication.
    *   `hooks/` & `context/`: For scalable global state management (e.g., authentication).

### **Backend**

*   **Framework:** A secure, stateless REST API built with **Node.js** and **Express**.
*   **Architecture:** The backend is logically decoupled into a modular structure to ensure maintainability and scalability:
    *   `controllers/`: Contains all business logic for API endpoints.
    *   `routes/`: Defines all API routes and connects them to the appropriate controllers.
    *   `models/`: Houses all Mongoose schemas for data validation.
    *   `middleware/`: For handling cross-cutting concerns like authentication.

### **Database**

*   **Service:** A flexible and horizontally scalable **MongoDB Atlas** cluster.
*   **ODM:** **Mongoose** is used to model application data, providing a straight-forward, schema-based solution to enforce data integrity and validation rules.

### **The Intelligence Core**

*   **Engine:** The **Google Gemini API** serves as the platform's "Analyst AI".
*   **Integration:** The backend securely constructs detailed, context-rich prompts based on user data. These prompts are sent to the Gemini API to power both the deep career analysis and the dynamic generation of objective quizzes.

---

## Local Development Setup

Follow these steps to run the project locally.

### **Prerequisites**

*   Node.js (v18 or later recommended)
*   npm
*   A MongoDB Atlas account and a connection string

### **1. Backend Setup**

1.  **Navigate to the backend directory:**
    ```bash
    cd "Express Backend"
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create the environment file:** Create a file named `.env` in the `Express Backend` root directory and add the following variables, replacing the placeholder values:
    ```
    MONGO_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET_KEY>
    GEMINI_API_KEY=<YOUR_GOOGLE_GEMINI_API_KEY>
    PORT=5005
    ```
4.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server should be running on `http://localhost:5005`.

### **2. Frontend Setup**

1.  **Navigate to the frontend directory in a new terminal:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:3000`.