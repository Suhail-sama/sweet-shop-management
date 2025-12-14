# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and real-time inventory management.

## 📋 Project Overview

This project was built as part of a TDD kata challenge to demonstrate skills in full-stack development, test-driven development practices, and modern development workflows. The application allows users to browse and purchase sweets, while administrators can manage the inventory through a complete CRUD interface.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Browse Sweets**: View all available sweets in an attractive card-based layout
- **Search & Filter**: Find sweets by name, category, or price range
- **Purchase System**: Buy sweets with real-time stock updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Add New Sweets**: Create new products with name, category, price, and initial stock
- **Edit Sweets**: Update product details and pricing
- **Delete Sweets**: Remove products from the inventory
- **Restock Management**: Increase stock quantities with a dedicated restock interface

## 🛠️ Tech Stack

### Frontend
- **React** (v18+) - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **Vitest** - Frontend testing (configured but pending implementation)

## 📁 Project Structure

```
sweetshop/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── sweetController.js    # Sweet CRUD operations
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Global error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Sweet.js              # Sweet schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── sweetRoutes.js        # Sweet endpoints
│   ├── tests/
│   │   ├── auth.test.js          # Auth tests
│   │   └── sweet.test.js         # Sweet tests
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SearchFilter.jsx
    │   │   ├── SweetCard.jsx
    │   │   ├── PurchaseModal.jsx
    │   │   ├── AddSweetModal.jsx
    │   │   ├── EditSweetModal.jsx
    │   │   └── RestockModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── sweetService.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test              # Run all tests in watch mode
npm run test:once     # Run tests once
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Sweet Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/sweets` | Get all sweets | Private |
| GET | `/api/sweets/search` | Search sweets | Private |
| GET | `/api/sweets/:id` | Get single sweet | Private |
| POST | `/api/sweets` | Create new sweet | Admin |
| PUT | `/api/sweets/:id` | Update sweet | Admin |
| DELETE | `/api/sweets/:id` | Delete sweet | Admin |
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Private |
| POST | `/api/sweets/:id/restock` | Restock sweet | Admin |

## 👤 Creating an Admin User

By default, new users are created with the "user" role. To create an admin user, you'll need to update the user document directly in MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or you can register normally and then modify the role field in the database.

## 📸 Screenshots

### Login Page
The clean and intuitive login interface with gradient background and error handling.

### Registration Page
User-friendly registration form with client-side validation.

### Dashboard - User View
Browse all available sweets with search and filter capabilities. Purchase sweets directly from the card interface.

### Dashboard - Admin View
Additional controls for administrators including Add, Edit, Delete, and Restock buttons on each sweet card.

### Purchase Modal
Interactive modal for selecting quantity with real-time total calculation.

### Admin Modals
Dedicated modals for adding new sweets, editing existing ones, and restocking inventory.

## 🧑‍💻 My AI Usage

Throughout this project, I leveraged AI tools to enhance my development workflow and productivity. Here's how I used them:

### Tools Used
- **Claude AI** (Anthropic) - Primary coding assistant

### How I Used AI

**Initial Project Structure**: I consulted Claude to help plan out the folder structure for both frontend and backend. This saved me time in the planning phase and helped me organize the project following best practices.

**Component Generation**: For repetitive React components like the modal dialogs (PurchaseModal, AddSweetModal, etc.), I used Claude to generate the initial boilerplate. I then customized each modal to fit the specific requirements - adding validation logic, adjusting the UI elements, and ensuring consistent styling across all modals.

**API Route Setup**: Claude helped me quickly scaffold the Express routes and controller structure. I provided the endpoint specifications from the kata requirements, and it generated the basic structure which I then refined with proper error handling and business logic.

**MongoDB Schema Design**: I discussed schema design patterns with Claude, particularly around the User and Sweet models. The AI suggested adding indexes for better search performance and helped me understand the trade-offs between different validation approaches.

**Middleware Implementation**: The JWT authentication middleware was initially generated with AI assistance, but I modified it significantly to add better error messages, handle edge cases, and improve the token verification logic.

**Debugging Assistance**: When I encountered the MongoDB connection options deprecation error, Claude quickly identified that `useNewUrlParser` and `useUnifiedTopology` were no longer needed in newer Mongoose versions. This saved me considerable debugging time.

**Code Refactoring**: I used AI to get suggestions on how to make my code more maintainable, like extracting the token generation logic into a separate function and improving my error handling patterns.

### Reflection

Using AI tools significantly accelerated my development process, especially for boilerplate code and initial setup tasks. However, I found that the real value came from using AI as a "pair programming" partner rather than just a code generator.

What worked well:
- Quick scaffolding of repetitive components
- Getting immediate answers to syntax questions
- Learning about best practices and design patterns
- Debugging assistance for cryptic error messages

What I learned:
- AI-generated code always needs review and often significant modification
- Understanding the "why" behind the code is crucial - I made sure to understand every line before committing
- AI is excellent for suggesting approaches, but I had to make the final architectural decisions
- Testing and validation still required my full attention and couldn't be fully automated

The key was maintaining a critical eye on all AI-generated code and ensuring everything aligned with the project requirements and my own coding standards. I estimate AI tools saved me about 30-40% of development time, mostly on repetitive tasks, allowing me to focus more on the interesting problems like state management and user experience design.

## 🔐 Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days (configurable)
- Protected routes require valid authentication tokens
- Role-based access control for admin features
- MongoDB injection protection through Mongoose
- CORS configuration restricts API access
- Environment variables keep sensitive data secure

## 🚧 Future Enhancements

- Add order history for users
- Implement payment gateway integration
- Add image upload for sweet products
- Create analytics dashboard for admins
- Add email notifications for low stock
- Implement wishlist functionality
- Add user reviews and ratings
- Export inventory reports (CSV/PDF)

## 🤝 Contributing

This project was created as part of a coding kata. Feel free to fork and expand upon it for your own learning purposes.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Suhail
- Email: suhailsama89@gmail.com
- GitHub: [Your GitHub Profile]

## 🙏 Acknowledgments

- Thanks to the team at [Company Name] for providing this interesting kata challenge
- The React and Node.js communities for excellent documentation
- MongoDB for their comprehensive guides on schema design

---

**Note**: This project demonstrates proficiency in full-stack development, RESTful API design, JWT authentication, React state management, and modern development practices including TDD and AI-assisted developme

---
![Demo 1](public/Screenshot%202025-12-14%20174324.png)
![Demo 2](public/Screenshot%202025-12-14%20174535.png)
![Demo 3](public/Screenshot%202025-12-14%20174618.png)
![Tests](D:\sweetshop\public\Screenshot 2025-12-14 190038.pnggit)






**Author**: Suhail Sama  
**Created**: December 2024

