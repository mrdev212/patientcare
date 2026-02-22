# Code Citations

## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```


## License: unknown
https://github.com/dev-faisal-ahmed/Lantabur-Softech-Job-Task/blob/5c02b5f03f0a0d151731ef7bf55f7e82d2a0118c/libs/connect-db.ts

```
Perfect! I can see this is a **Next.js project** with NextAuth. Let me give you step-by-step instructions to connect MongoDB:

## **Step-by-Step Guide to Connect MongoDB**

### **Step 1: Install MongoDB Driver**
Open your terminal in the project root and run:
```bash
npm install mongodb
```
Or if you prefer **Mongoose** (recommended for easier schema management):
```bash
npm install mongoose
```

### **Step 2: Create Environment Variables**
Create a `.env.local` file in your project root:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```
Replace with your MongoDB connection string from MongoDB Atlas.

### **Step 3: Create a MongoDB Connection File**
Create `lib/mongodb.js` (or `lib/mongodb.ts` for TypeScript):

**Using Mongoose:**
```javascript
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongoose => mongoose
```

