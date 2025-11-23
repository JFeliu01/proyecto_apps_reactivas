# Reactive Applications Project

This project consists of a frontend developed with React and a simple backend using `json-server`. It is a clone of pages like [u.gg](https://u.gg/) and [op.gg](https://op.gg/) where you can check statistics and builds for champions from the video game League of Legends using the same Riot API (TODO).

## Requirements

- Node.js (v22 or higher)
- npm

## Installation and Execution

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```
    The backend will be running at `http://localhost:3001`.

### Frontend

1.  **Open a new terminal.**

2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or on the port that Vite indicates in the terminal).

### Tests E2E

1.  **Open two separate terminals and run both the frontend and the backend. Make sure both servers are running before executing the tests.**

2. **Open a third terminal and navigate to the /test_e2e directory.**

3. **Run the Playwright installation command (only required the first time)**

    ```bash
    npx playwright install
    ```
4. **Run the Tests**

    ```bash
    npx playwright test
    ```

    **use this command if you want to see it with the UI**

    ```bash
    npx playwright test --ui   
    ```

    **There are three end-to-end tests included:**

    User Registration — Creates a new account and verifies the user is logged in after registering.

    User Login — Logs in with an existing user and confirms authentication is successful.

    Favorites CRUD — Adds three favorite champions and later removes them from the user profile, verifying both operations.