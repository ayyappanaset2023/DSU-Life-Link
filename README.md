# LifeLink: Emergency Blood & Support System

LifeLink is a full-stack, real-time web application built with React.js that instantly connects blood donors, patients, and hospitals when every second counts. It features robust role-based access, automated geolocation matching, and real-time blood stock dashboards.

## Features Built
- **Role-Based Portals**: Interfaces for Donors, Hospitals, Patients, and Admin.
- **Emergency Alert SOS**: 1-click broadcast notification for critical requests.
- **Real-time Live Inventory**: Hospitals can manage blood groups visually.
- **Reward System**: Auto-generates shareable PDF certificates for hero donors.
- **Community Feed**: Public timeline to appreciate donors and encourage saving lives.

## Environment Variables (.env) Setup
Create a `.env` file in the root directory and copy the contents of `.env.example`.

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create a new project.
3. Enable **Authentication** (Email/Password & Phone).
4. Enable **Firestore Database** and **Storage**.
5. Add a Web App to your project to get your configuration keys and paste them into your `.env`.

### Twilio API Setup (For SMS / WhatsApp Alerts)
To enable the SMS blast functionality when an emergency request is made:
1. Create an account at [Twilio](https://www.twilio.com/).
2. Navigate to your Twilio Console Dashboard.
3. Copy your `ACCOUNT_SID` and `AUTH_TOKEN`.
4. Purchase or get a free Twilio Phone Number capable of sending SMS.
5. Paste these into your `.env` file.
*(Note: Active calling requires a backend Node.js function. Since we are using Firebase, you will deploy a Firebase Cloud Function using these Twilio keys to broadcast texts secretly.)*

## Deployment on Vercel
1. Run `npm run build` locally to verify the app compiles correctly.
2. Push your code to a GitHub repository.
3. Go to [Vercel](https://vercel.com/) and import the repository.
4. Go to **Environment Variables** in the Vercel project settings and paste all the keys from your `.env` file.
5. Click **Deploy**. Vercel will automatically detect the Vite builder and serve your production app!
