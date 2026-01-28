# Parking-System-MERN
### Features
#### Admin
  - can add, update or remove a parking area
  - can view all bookings
#### User
  - can view parking areas (can also view **NEARBY** parking areas)
  - can view parking area location in Google Maps
  - can select parking area and timeslot
  - can view booked and available slots
  - can book an available slot
  - can **PAY using credit card**
  - can view his/her upcoming bookings
### Tech Stack
  - ReactJS (+ material-ui, redux)
  - NodeJS (+ expressJS)
  - MongoDB (+ mongoose)
### Setup
#### Backend
1. Move into directory:
    - cd backend
2. Create .env file with following variables:
    - PORT
    - MONGO_URI
    - JWT_SECRET
    - ADMIN_EMAIL
    - ADMIN_PASSWORD
    - STRIPE_PRIVATE_KEY
    - CLIENT_URL
3. Run these commands:
    - npm i
    - npm start

#### Frontend
1. Move into directory:
    - cd frontend
2. Create .env file with following variables:
    - REACT_APP_BACKEND_URL
3. Run these commands:
    - npm i
    - npm run dev
