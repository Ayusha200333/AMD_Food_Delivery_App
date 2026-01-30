🍔🚚 Foodora – Food Delivery Mobile App

## 📌 Project Overview

**Foodora** is a cross-platform food delivery mobile application developed as the final coursework for the *Advanced Mobile Developer (AMD)* module. The application is built using **React Native with Expo**, focusing on real-world mobile app concepts such as authentication, state management, CRUD operations, and intuitive navigation.

The app allows users to:

* Register and log in securely
* Browse food items
* Place and manage food orders
* View order history

## 🎯 Project Objectives

* Develop a cross-platform mobile application using **React Native Expo**
* Implement **user authentication**
* Apply **state management** concepts
* Perform **CRUD operations** on a central data model
* Integrate **navigation** (Stack & Tab)
* Ensure a **user-friendly and responsive UI**
* Produce a runnable mobile build

---

## 🛠️ Technologies Used

### Frontend

* React Native
* Expo
* TypeScript
* Expo Router
* React Context API (State Management)
* React Navigation (Stack & Tab)

### Backend / Services

* Firebase Authentication
* Firebase Firestore (Cloud Database)

## 🔐 Authentication

The application uses **Firebase Authentication** to handle:

* User Registration (Sign Up)
* User Login (Sign In)
* Secure session handling

Only authenticated users can access core application features such as ordering and viewing personal data.

---

## 📦 Core Functionality (CRUD)

The central data model of the application is **Orders**.

### CRUD Operations Implemented:

* **Create:** Place a new food order
* **Read:** View available food items and order history
* **Update:** Modify order details before checkout
* **Delete:** Remove items from cart / cancel orders

All data is persisted using **Firebase Firestore**.

---

## 📱 User Interface

* Mobile-first design
* Clean and intuitive layouts
* Responsive across different screen sizes
* Consistent icons and color themes

---

## ▶️ How to Run the Project Locally

### Prerequisites

* Node.js (v16 or above recommended)
* Expo CLI installed globally
* Android Studio Emulator or Physical Device

### Steps

```bash
# Clone the repository
git clone https://github.com/Ayusha200333/AMD_Food_Delivery_App.git

# Navigate to project directory
cd AMD_Food_Delivery_App

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

* Scan the QR code using **Expo Go** app on your mobile device
* Or run on Android Emulator

---

## 📦 Build Information

* Platform: **Android**
* Build Type: **Expo Build / APK**
* The build is included as part of the final submission





