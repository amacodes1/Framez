# Framez - Social Media Mobile App 📱

Framez is a modern social media mobile application built with React Native and Expo. Users can share posts with text and images, view a feed of all posts, and manage their profile.

## Features ✨

- **User Authentication**: Secure login and registration with persistent sessions
- **Create Posts**: Share text and image posts with the community
- **Feed**: View all posts from users in chronological order
- **Profile**: View user information and personal posts
- **Real-time Updates**: Refresh feed to see latest posts
- **Image Upload**: Add photos to posts using device camera or gallery

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Backend**: Convex (configured for real-time data)
- **State Management**: Redux Toolkit
- **Navigation**: Expo Router
- **Storage**: Expo SecureStore for authentication persistence
- **UI**: Native components with custom styling

## Setup Instructions 🚀

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Framez
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

## Project Structure 📁

```
Framez/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth.tsx           # Authentication screen
│   └── index.tsx          # App entry point
├── components/            # Reusable UI components
│   ├── PostCard.tsx       # Individual post display
│   └── CreatePost.tsx     # Post creation modal
├── store/                 # Redux store configuration
│   ├── authSlice.ts       # Authentication state
│   └── index.ts           # Store setup
├── services/              # API and authentication services
│   └── auth.ts            # Authentication service
├── convex/                # Backend functions (Convex)
│   ├── schema.ts          # Database schema
│   ├── users.ts           # User operations
│   └── posts.ts           # Post operations
└── constants/             # App constants and theme
    └── theme.ts           # Color and styling constants
```

## Key Features Implementation 🔧

### Authentication
- Secure login/registration flow
- Persistent sessions using Expo SecureStore
- Automatic redirect based on auth state

### Posts
- Create posts with text and optional images
- Image picker integration for photo uploads
- Chronological feed display
- User-specific post filtering

### Profile
- User information display
- Personal post history
- Post count statistics
- Logout functionality

## Backend Configuration (Convex) ⚙️

The app is configured to work with Convex for real-time data management:

1. **Database Schema**: Users and Posts tables with proper indexing
2. **Real-time Queries**: Automatic updates when data changes
3. **Mutations**: Create users and posts with validation

## Testing 📱

### Expo Go
- Install Expo Go on your mobile device
- Scan the QR code from `npx expo start`
- Test all features on actual device

### Simulators
- **iOS**: Requires Xcode and iOS Simulator
- **Android**: Requires Android Studio and AVD

## Deployment 🚀

### Appetize.io Hosting
1. Build the app: `npx expo build:web`
2. Upload to Appetize.io for web-based mobile testing
3. Share the hosted link for demo purposes

### Production Build
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

## Environment Variables 🔐

Create a `.env` file for production:
```
CONVEX_DEPLOYMENT=your-convex-deployment-url
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is licensed under the MIT License.

---

**Built with ❤️ using React Native and Expo**
