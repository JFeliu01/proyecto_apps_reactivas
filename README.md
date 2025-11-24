# Reactive Applications Project - LoL.GG

This project consists of a frontend developed with React and a backend using Express + MongoDB. It is a clone of pages like [u.gg](https://u.gg/) and [op.gg](https://op.gg/) where you can check statistics and builds for champions from the video game League of Legends.

## Requirements

- Node.js (v18 or higher)
- npm
- Vite (7.1.2)
- React (19.1.1)

Frontend: 
- Tailwind (3.4.17)
- Zustand (5.0.8)

Backend:
- bcryptjs (2.4.3)
- MongoDB (mongoose - 8.19.1)
- cookie-parser (1.4.7)
- cors (2.8.5)
- dotenv (16.4.5)
- express (5.1.0)
- jsonwebtoken (9.0.2)

Testing:
- playwright (1.56.1)


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

3.  **Start MongoDB:**
    ```bash
    # Linux/Mac
    sudo systemctl start mongodb
    
    # Or if using Docker
    docker run -d -p 27017:27017 mongo
    ```

4.  **Start the server:**
    ```bash
    npm run dev
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

### Route map

- "/" (Landing Page):
Entry point of the application. If the user is already authenticated, they are automatically redirected to "/grid".

- "/grid" (Champion List):
Displays the full catalog of champions.
Clicking the profile button or View Profile redirects to "/profile".
Clicking View Details on a champion card navigates to "/champion/:championId".

- "/champion/:championId" (Champion Details):
Shows the champion’s full information. Includes a Back to champion list button that redirects to "/grid".

- "/profile" (User Profile):
Shows detailed information of the authenticated user.
Includes a button to return to the champion list.
If the user has favorite champions, clicking on any of them opens their detailed page, just like in "/grid".


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

    1. User registration
    Creates a new account and verifies the user is logged in after completing the registration.
    Flow:

    - From the landing page, the user clicks the profile button.
    - Selects Register.
    - Fills out and submits the registration form.

    2. User Login 
    Logs in with an existing user and confirms that authentication is successful.
    Flow:

    - From the landing page, the user clicks the profile button.
    - Selects Login.
    - Fills out and submits the login form.
    
    3. Favorites CRUD 
    Adds three champions to favorites and later removes them, verifying both operations.
    Flow:

    - Login as in the previous test.
    - Navigate to the champion list.
    - Mark Ahri, Garen, and Lux as favorites via the favorite button inside the champion detail modal.
    - Open the user profile and confirm the three champions appear in the favorites section.
    - Return to the champion list, re-open each detail view, and remove them from favorites.
    - Go back to the profile and confirm that the favorites list is now empty.

## Styling Library and Design Decisions

The project uses TailwindCSS

# Landing Page
Introduces the application and its main functionalities with a clean and straightforward design.

# Login and Registration
Follow a familiar, traditional layout to ensure clarity and ease of use.

# Champion List
As the core of the application, the design emphasizes clarity and visual organization:

- Champions are displayed with an image and name for quick recognition.
- Includes a role filter: All, Top, Jungle, Mid, ADC, Support.
- Positioned centrally/right to improve visual hierarchy.
- Includes a search bar and sorting options (alphabetical or by difficulty), aligned to the right for visual symmetry.

# Champion Detail (summary view)

A small modal-style window displaying:

- Role/class
- Short description of playstyle
- Key stats
- View Details button
- Favorite button where users can mark up to three champions as favorites for quick access from the profile.

# Champion Detail (full page)

Includes everything from the summary view plus the full character lore.

# View Profile

Displays:
- Username
- Email
- Player rank (visual decoration)
- A list of favorited champions. Each favorite is clickable and leads directly to the champion’s full detail page.

This design choice keeps important user information accessible while maintaining fluid navigation within the SPA.



## Production Deployment

### Quick Start: Run the deployment script for your operating system:

**Windows:**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

After running the deployment script, you will need to manually configure the server, connect using:

```bash
ssh -p 219 fullstack@fullstack.dcc.uchile.cl
```

Then  kill the node app using:
```bash
pkill -f 'lolgg/backend'
```

Verify the port is free using:
```bash
ss -tlnp | grep 7153
```

If the port is not free, kill the process reading its PID and using:
```bash
kill -9 <PID>
```

Then run the setup-server.sh script:
```bash
cd ~/lolgg/backend
chmod +x setup-server.sh
./setup-server.sh
```

Then start the node app using:
```bash
nohup npm start > server.log 2>&1 &
```

Then you can access the application at: http://fullstack.dcc.uchile.cl:7153