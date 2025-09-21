# School Payment and Dashboard Application

A comprehensive full-stack application for managing school payments with a modern React frontend and Express.js backend, integrated with MongoDB Atlas and payment gateway APIs.

## 🚀 Features

### Backend (Express.js + MongoDB Atlas)
- **RESTful API** with Express.js
- **MongoDB Atlas** integration with proper connection handling
- **JWT Authentication** for secure API endpoints
- **Payment Gateway Integration** with Edviron API
- **Webhook Support** for real-time payment status updates
- **Comprehensive Logging** and error handling
- **Pagination & Filtering** for transaction queries

### Frontend (React + Tailwind CSS)
- **Modern React Dashboard** with Vite
- **Dark Mode Support** with theme switching
- **Responsive Design** with Tailwind CSS
- **Real-time Data Visualization** with charts
- **Transaction Management** with advanced filtering
- **Payment Creation** interface
- **School-specific** transaction views

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EdvironAssignment-main
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

### 3. MongoDB Atlas Setup

#### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in to your account
3. Create a new cluster (choose the free tier for development)
4. Wait for the cluster to be created (usually takes 3-5 minutes)

#### Step 2: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Select "Read and write to any database"
6. Click "Add User"

#### Step 3: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - **For production**: Add only your server's IP address
4. Click "Confirm"

#### Step 4: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version 4.1 or later
5. Copy the connection string

#### Step 5: Update Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your MongoDB Atlas connection string:
```env
# Database Configuration - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school_payment_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_here

# Payment Gateway Configuration
API_KEY=your_edviron_api_key_here
PG_KEY=edvtest01
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace the following in your MongoDB URI:
- `username` with your database username
- `password` with your database password
- `cluster0.xxxxx` with your actual cluster name

### 4. Frontend Setup

   ```bash
cd Frontend
   npm install
   ```

### 5. Start the Application

#### Start Backend Server
   ```bash
cd Backend
npm start
```

#### Start Frontend Development Server
   ```bash
cd Frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### MongoDB Atlas Connection Troubleshooting

If you encounter connection issues:

1. **IP Whitelist**: Ensure your IP address is whitelisted in MongoDB Atlas
2. **Connection String**: Verify the connection string format
3. **Credentials**: Check username and password
4. **Network**: Ensure you're not behind a restrictive firewall

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `API_KEY` | Edviron payment gateway API key | Yes |
| `PG_KEY` | Payment gateway secret key | Yes |
| `SCHOOL_ID` | Default school ID for payments | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Transaction Endpoints
- `GET /api/transactions` - Get all transactions (with pagination & filtering)
- `GET /api/transactions/:schoolId` - Get transactions by school
- `GET /api/transactions/status/:customOrderId` - Check transaction status
- `POST /api/create-payment` - Create new payment request

### Webhook Endpoints
- `POST /api/webhook` - Payment status webhook
- `POST /api/update-status` - Manual status update

### Query Parameters for Transactions
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (SUCCESS, PENDING, FAILED)
- `school_id` - Filter by school ID
- `gateway` - Filter by payment gateway
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

## 🗄️ Database Schema

### Orders Collection
```javascript
{
  _id: ObjectId,
  school_id: String,
  trustee_id: String,
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: String,
  order_amount: Number,
  custom_order_id: String,
  collect_request_id: String,
  collect_request_url: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Status Collection
```javascript
{
  _id: ObjectId,
  collect_id: ObjectId (ref: Orders),
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String (SUCCESS, PENDING, FAILED),
  error_message: String,
  payment_time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Webhook Logs Collection
```javascript
{
  _id: ObjectId,
  event_type: String,
  payload: Mixed,
  status: String (SUCCESS, FAILED, PROCESSING),
  error_message: String,
  processed_at: Date,
  collect_request_id: String,
  order_id: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. **Prepare for deployment**:
   - Update CORS settings in `Backend/index.js`
   - Set production environment variables
   - Update `FRONTEND_URL` to your deployed frontend URL

2. **Deploy to Render**:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables in Render dashboard

### Frontend Deployment (Vercel/Netlify)

1. **Update API URL**:
   - Change `Base_url` in `Frontend/src/constants.js`
   - Point to your deployed backend URL

2. **Deploy to Vercel**:
   - Connect your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Deploy automatically

## 🧪 Testing

### Postman Collection
Import the `Backend/postman_collection.json` file into Postman to test all API endpoints.

### Manual Testing
1. Register a new user
2. Login to get JWT token
3. Create a payment request
4. Check transaction status
5. Test webhook endpoints

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Error handling without sensitive data exposure
- MongoDB Atlas security features

## 📱 Frontend Features

### Pages
- **Dashboard**: Overview with charts and statistics
- **Transactions**: Full transaction list with filtering
- **School Transactions**: School-specific transaction view
- **Transaction Status Check**: Check individual transaction status
- **Create Payment**: Create new payment requests

### Components
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Tables**: Mobile-friendly transaction tables
- **Real-time Charts**: Payment method and status visualizations
- **Advanced Filtering**: Multi-criteria transaction filtering

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**:
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string format
   - Ensure credentials are correct

2. **CORS Errors**:
   - Update `FRONTEND_URL` in backend environment
   - Check CORS configuration

3. **Payment Gateway Errors**:
   - Verify API key and secret
   - Check JWT signing implementation
   - Ensure callback URL is accessible

4. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review MongoDB Atlas documentation

---

**Note**: This application is configured for development. For production deployment, ensure you:
- Use strong, unique secrets
- Configure proper CORS settings
- Set up proper error monitoring
- Use HTTPS for all communications
- Regularly update dependencies