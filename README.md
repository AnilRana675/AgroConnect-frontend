# 🌱 AgroConnect Frontend

A modern React-based web application for agricultural assistance, providing farmers with 🤖 AI-powered insights, 🌐 multilingual support, and 🎤 voice-enabled interactions.

## 🚀 Features

### 🌟 Core Features

- **🤖 AI Assistant**: Intelligent agricultural advice powered by GitHub Models AI
- **🎤 Voice Input**: Speech-to-text functionality for hands-free interaction
- **🔊 Text-to-Speech**: Audio feedback in multiple languages including Nepali
- **🌐 Multilingual Support**: English and Nepali language support with i18next
- **📱 Responsive Design**: Mobile-first responsive UI using Material-UI components
- **🔒 Authentication**: Secure user registration, login, and email verification
- **🌱 Plant Identification**: AI-powered plant disease detection and treatment recommendations

### 💡 User Experience

- **✨ Modern UI**: Clean, intuitive interface with Material-UI components
- **⚡ Fast Loading**: Optimized bundle size and performance
- **🔄 Real-time Updates**: Live feedback and status updates
- **📧 Email Integration**: Automated email verification and password reset
- **🧭 Smart Navigation**: Context-aware routing and navigation

## ⚡ Quick Start

### 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnilRana675/AgroConnect-frontend.git
   cd AgroConnect-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables in `.env`:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### 🧑‍💻 Development Scripts

```bash
# Start development server
npm start

# Start with development environment
npm run start:dev

# Start production build locally
npm run start:prod
```

### 🏗️ Build Scripts

```bash
# Build for production
npm run build

# Build for development
npm run build:dev

# Build for production with optimizations
npm run build:prod
```

### ✅ Quality Assurance

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── LanguageSwitcher.tsx
│   └── VoiceInput.tsx
├── pages/               # Page components and routing
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── EmailVerificationPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── UserPage.tsx
│   └── index.ts
├── services/            # API and external service integrations
│   ├── aiService.ts
│   ├── authService.ts
│   ├── emailService.ts
│   ├── plantService.ts
│   ├── registrationService.ts
│   ├── translationService.ts
│   ├── TTSServices.ts
│   ├── userService.ts
│   ├── api.ts
│   └── index.ts
├── i18n/               # Internationalization
│   ├── index.ts
│   └── locales/
```

## 🛠️ Key Technologies

### ⚛️ Frontend Framework

- **React 19.1.0**: Latest React with modern hooks and features
- **TypeScript 4.9.5**: Type-safe development
- **React Router 7.7.0**: Client-side routing

### 🎨 UI & Styling

- **Material-UI 7.2.0**: Modern React component library
- **Emotion**: CSS-in-JS styling solution
- **Lucide React**: Beautiful icons

### 🌍 Internationalization

- **i18next 23.15.1**: Internationalization framework
- **react-i18next 14.1.3**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

### 🗣️ Voice & Audio

- **react-speech-recognition 3.10.0**: Speech-to-text functionality
- **Web Speech API**: Browser-native speech recognition

## 🔗 API Integration

The frontend integrates with the AgroConnect backend API:

### ⚙️ Base Configuration

```typescript
// Example API configuration
const API_URL = process.env.REACT_APP_API_URL;
```

## 🔐 Authentication Flow

1. **Registration**: User creates account with email verification
2. **Email Verification**: Automated email with verification link
3. **Login**: Secure authentication with JWT tokens
4. **Password Reset**: Email-based password recovery
5. **Protected Routes**: Authenticated access to user features

## 🌐 Internationalization

### 🌏 Supported Languages

- **English (en)**: Default language
- **Nepali (ne)**: Full translation support

### 🛎️ Language Features

- Automatic language detection
- Dynamic language switching
- Context-aware translations

## 📱 Responsive Design

### 📏 Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### 📲 Features

- Mobile-first approach
- Touch-friendly interactions
- Optimized performance on mobile devices

## 🧪 Testing

### 🏃 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### 🏗️ Build for Production

```bash
npm run build:prod
```

### ⚙️ Environment Variables

```env
REACT_APP_API_URL=https://api.agroconnect.com
REACT_APP_ENV=production
```

## 🤝 Contributing

### 🛠️ Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### 📝 Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support and questions:

- GitHub Issues: [Report bugs or request features](https://github.com/AnilRana675/AgroConnect-frontend/issues)
- Documentation: Check this README and inline code comments

## 🙏 Acknowledgments

- React team for the amazing framework
- Material-UI for the component library
- i18next for internationalization
- All contributors and supporters of the project

---

**AgroConnect Frontend** - Empowering farmers with technology 🚜
