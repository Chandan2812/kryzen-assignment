# Form Data Creator

## Project Overview

This project focuses on user authentication, data collection using form and convert collected data in PDF format.

## Technologies

1. Frontend: React.js
2. Backend: Node.js
3. Database: MongoDB 
4. Authentication: JSON Web Token (JWT)
5. PDFKit: PDF generation library

## Project Features:

### 1. User Authentication

Implemented user authentication for secure access to the application. Users can:
- Register a new account with a unique username and password.
- Log in securely with their credentials.
- Access specific pages only when authenticated.

### 2. Data Collection Form

Created a simple form to collect user information:
- Name
- Age
- Address
- Photo (upload functionality)

### 3. Data Display and Preview

After submitting the form, display the collected data as a preview to the user.

### 4. PDF Download

Provided users with the option to download collected data in PDF format. The PDF should be dynamically generated and include all form information.

### Running Locally:

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Chandan2812/kryzen-assignment.git
   
2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=8000
    DATABASE_URL=Your database url
    SECRET_KEY=secretkey
    ```

4. **Run the application:**
    ```bash
    npm run server
    ```
    The API server will be running at `http://localhost:8000`.

## API Routes

- **User Registration:**
  `POST /auth/register`

- **User Login:**
  `POST /auth/login`

- **Form Submission**
  `POST /pdf/submit`

- **Preview Form**
  `GET /pdf/preview/:id`
