# FreelanceHub

A web app where you can browse freelance services, save ones you like, and hire them.

## What it does

- Shows a list of services like logo design, web development, writing etc
- You can search for a service by name
- You can filter by category and sort by price or rating
- Click a service to see more details
- Save or hire a service from the popup
- You can also drag a card into the drop zone to save it
- Dashboard shows everything you saved or hired

## How to run it

Make sure Node.js is installed on your computer first.

Open a terminal inside the FreelanceHub folder and run:

```
npm install express cors
node server/server.js
```

Then open your browser and go to:

```
http://localhost:3000
```

## API endpoints

- GET /api/services — returns all services
- GET /api/services/:id — returns one service
- POST /api/services — adds a new service
- POST /api/save — saves a service
- POST /api/hire — hires a service
- GET /api/saved — returns saved services
- GET /api/hired — returns hired services

## Files

- client/index.html — the frontend page
- client/css/style.css — all the styling
- client/js/app.js — frontend logic
- server/server.js — the backend server
