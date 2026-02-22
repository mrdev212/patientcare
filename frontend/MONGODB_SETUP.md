# MongoDB Login & Signup Setup Guide

## ✅ Files Created

I've created all the necessary files for MongoDB integration:

### Backend Files:
- `lib/mongodb.js` - MongoDB connection handler
- `models/User.js` - User database schema
- `pages/api/signup.js` - Signup API endpoint
- `pages/api/login.js` - Login API endpoint

### Frontend Files:
- `signup.html` - Signup page (new)
- `login.html` - Updated with API integration
- `Patientlogin.html` - Updated with API integration

### Configuration:
- `package.json` - Updated with mongoose & bcrypt dependencies
- `.env.local` - Environment variables template

---

## 🚀 Step 1: Install Dependencies

In the `frontend` folder, run:

```bash
npm install
```

This will install:
- `mongoose` - MongoDB ODM (Object Data Modeling)
- `bcrypt` - Password hashing library
- Other dependencies

---

## 🔗 Step 2: Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (if you don't have one)
3. Create a free cluster
4. Click "Connect" → "Drivers" → Copy connection string
5. It will look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydbname?retryWrites=true&w=majority
   ```

---

## 📝 Step 3: Add MongoDB URI

Open `.env.local` in your `frontend` folder and replace:

```
MONGODB_URI=YOUR_CONNECTION_STRING_HERE
```

Example:
```
MONGODB_URI=mongodb+srv://john:mypassword@cluster0.abcdef.mongodb.net/healthguard?retryWrites=true&w=majority
```

---

## ▶️ Step 4: Start Your Next.js Server

```bash
npm run dev
```

Your app will run on `http://localhost:3000`

---

## 📋 Step 5: Test the Setup

### Signup:
1. Go to `http://localhost:3000/signup.html`
2. Enter email and password
3. Click "Create Account"
4. You should see a success message and be redirected to login

### Login:
1. Go to `http://localhost:3000/login.html` (or Patientlogin.html)
2. Enter email and password
3. Click "Secure Login"
4. You should be redirected to dashboard

---

## 🗄️ Database Structure

Your MongoDB database will have:
- **Database name**: `healthguard` (change in `.env.local` if needed)
- **Collection**: `users`
- **Fields in each user**:
  - `_id` - Auto-generated unique ID
  - `email` - User email (unique)
  - `password` - Hashed password (secure)
  - `createdAt` - Account creation date

---

## 🔐 Security Features

✅ Passwords are hashed with bcrypt (not stored as plain text)
✅ Email must be unique
✅ Email validation
✅ Password length validation (min 6 characters)
✅ Error handling on both frontend and backend

---

## 📂 Final Folder Structure

```
frontend/
├── lib/
│   └── mongodb.js
├── models/
│   └── User.js
├── pages/
│   └── api/
│       ├── login.js
│       └── signup.js
├── signup.html
├── login.html
├── Patientlogin.html
├── package.json
├── .env.local
└── [other files]
```

---

## ⚠️ Important Notes

1. **Never commit `.env.local`** - Keep it private (add to `.gitignore`)
2. **Keep your MongoDB password secure** - Don't share connection string
3. **Test locally first** before deploying to production
4. All passwords are automatically hashed - no plain text in database

---

## 🐛 Troubleshooting

**Error: "MongoDB connection failed"**
- Check `.env.local` has correct URI
- Check MongoDB Atlas IP whitelist (allow all IPs for testing)

**Error: "Email already exists"**
- It means user is already registered

**Error: "Invalid email or password"**
- Check email and password match

---

## ✨ Next Steps (Optional)

After basic setup works, you can add:
- Password reset feature
- Email verification
- Remember me functionality
- Two-factor authentication
- Profile management

---

## 📞 Need Help?

Check console logs in browser (F12 → Console tab) for detailed error messages.

Server logs will show in your terminal where you ran `npm run dev`.
