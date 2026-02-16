# Nexus Campus - Smart Dining Platform 🍽️

A comprehensive campus dining management system with real-time chat, meal check-ins, sustainability tracking, and predictive analytics.

## 🌟 Features

### Authentication & User Management
- ✅ Secure user registration and login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Student ID verification

### Smart Dining
- 🍽️ Daily meal check-ins (Breakfast, Lunch, Dinner)
- 📊 Nutritional information for each meal
- ⭐ Meal rating and feedback system
- 📅 Weekly menu overview
- 🎯 Smart deadline management

### Sustainability Tracking
- 🌱 Eco Points reward system
- ♻️ Food waste prevention tracking
- 💧 Water conservation metrics
- 🌍 CO₂ emissions reduction tracking

### Campus Buzz (Real-time Chat)
- 💬 Multi-channel chat system
- 👥 Online user presence
- 🔥 Trending topics
- ⚡ Socket.IO for real-time messaging

### Analytics & Insights
- 📈 Personal analytics dashboard
- 📊 Weekly check-in patterns
- 🏆 Campus-wide leaderboard
- 🎯 Meal distribution analysis

### Live Monitoring (Kitchen Staff)
- 📡 Real-time check-in tracking
- 🔮 AI-powered attendance prediction
- 🌦️ Weather-based adjustments
- 🎉 Special event handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **Tailwind CSS** - Styling
- **JavaScript (Vanilla)** - Interactivity
- **Font Awesome** - Icons
- **Socket.IO Client** - Real-time updates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- npm (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd nexus-campus

# Or simply extract the files to a folder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- socket.io

### 3. Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   # MongoDB runs as a service automatically
   ```
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your connection string

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nexus-campus

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-random-string-here

# Server Port
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a secure random string!

### 5. Seed the Database

Populate the database with initial menu data:

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Cleared existing data
✅ Successfully seeded weekly menu data
📊 Database seeding completed successfully!
```

### 6. Start the Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

Server will start on `http://localhost:5000`

### 7. Serve the Frontend

You need a local web server to run the frontend. Choose one:

**Option A: Using Python (simplest)**
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**Option B: Using Node.js http-server**
```bash
# Install globally
npm install -g http-server

# Run
http-server -p 3000
```

**Option C: Using VS Code Live Server**
1. Install "Live Server" extension
2. Right-click on `login.html`
3. Select "Open with Live Server"

### 8. Access the Application

1. Open browser and navigate to: `http://localhost:3000/login.html`
2. Register a new account
3. Start using the platform!

## 📁 Project Structure

```
nexus-campus/
├── server.js              # Main backend server
├── seedData.js            # Database seeding script
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── .env.example           # Example environment file
├── login.html             # Login/Register page
├── index.html             # Main application (your existing file)
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login user
GET    /api/auth/me        - Get current user (requires auth)
```

### Check-ins
```
POST   /api/checkins               - Create meal check-in
GET    /api/checkins/my            - Get user's check-ins
GET    /api/checkins/today         - Get today's check-ins
POST   /api/checkins/:id/feedback  - Submit meal feedback
```

### Menu
```
GET    /api/menu/weekly    - Get weekly menu
```

### Messages (Campus Buzz)
```
GET    /api/messages/:channel  - Get channel messages
POST   /api/messages           - Post new message
```

### Analytics
```
GET    /api/analytics/my   - Get personal analytics
GET    /api/leaderboard    - Get campus leaderboard
```

## 🔐 Authentication Flow

1. User registers/logs in → Receives JWT token
2. Token stored in localStorage
3. Token sent in Authorization header: `Authorization: Bearer <token>`
4. Backend verifies token for protected routes

## 🧪 Testing the API

Use Postman, Insomnia, or curl to test endpoints:

```bash
# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.edu",
    "studentId": "STU123456",
    "department": "Computer Science",
    "year": 3,
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.edu",
    "password": "password123"
  }'

# Get User Info (replace <token> with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Try connecting with MongoDB Compass

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### CORS Errors
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in `.env`
- Verify CORS is enabled in `server.js`

### JWT Token Issues
- Clear localStorage in browser DevTools
- Re-login to get fresh token
- Check JWT_SECRET in `.env`

## 📝 Default Test Account

After seeding, you can create a test account:

```
Email: test@college.edu
Password: test123
Student ID: TEST001
```

(You need to register this manually through the UI)

## 🔒 Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Enable rate limiting** for API endpoints
4. **Validate all inputs** on backend
5. **Use environment variables** for sensitive data
6. **Enable MongoDB authentication** in production

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create nexus-campus-api
heroku addons:create mongolab
git push heroku main
```

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `none`
3. Set publish directory: `./`
4. Add environment variable: `API_URL`

## 📊 Database Schema

### User
- name, email, password (hashed)
- studentId, department, year
- ecoPoints, totalMeals, streakDays
- wasteSaved, rank

### CheckIn
- userId, mealType, mealName
- date, rating, feedback
- nutritionData (calories, protein, carbs, fat)

### Message
- userId, userName, userAvatar
- channel, content, timestamp

### Menu
- day (Monday-Sunday)
- breakfast, lunch, dinner (with nutrition data)
- weekStartDate

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@nexuscampus.edu
- Discord: [Join our server]

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] QR code check-in
- [ ] Advanced analytics dashboard
- [ ] Integration with campus ID systems
- [ ] Dietary preference management
- [ ] Allergen tracking
- [ ] Meal pre-ordering

---

Made with ❤️ for smarter campus dining
