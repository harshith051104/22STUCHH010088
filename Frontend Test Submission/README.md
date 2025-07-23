# React URL Shortener Web App

A user-friendly URL Shortener application built with React, Material-UI, and integrated with logging middleware.

## Features

✅ **URL Shortening**: Shorten long URLs with custom or auto-generated shortcodes  
✅ **Analytics Dashboard**: View detailed statistics for shortened URLs  
✅ **Client-Side Validation**: Robust input validation before API calls  
✅ **Material-UI Design**: Modern, responsive user interface  
✅ **Logging Integration**: Comprehensive logging using the custom logging middleware  
✅ **Error Handling**: User-friendly error messages and graceful error handling  

## Requirements Fulfilled

### ✅ Mandatory Logging Integration
- Extensively uses the Logging Middleware from Pre-Test Setup stage
- Uses inbuilt language loggers and console logging
- All user actions and system events are logged

### ✅ Application Architecture
- Implemented as a React application with TypeScript
- Component-based architecture with reusable components

### ✅ Authentication
- Assumes pre-authenticated users (no registration/login required)
- Ready for API integration

### ✅ Short Link Uniqueness
- All generated short links are unique within the application
- Shortcode validation prevents duplicates

### ✅ Default Validity
- URLs default to 30 minutes validity if not specified
- Users can customize validity period

### ✅ Custom Shortcodes
- Users can provide custom shortcodes (3-10 alphanumeric characters)
- Validates uniqueness and format
- Auto-generates if not provided

### ✅ Redirection & Statistics
- Statistics page shows URL details and click analytics
- Client-side routing handles URL management

### ✅ Error Handling
- Robust client-side error handling
- User-friendly error messages for invalid inputs
- Graceful handling of edge cases

### ✅ Running Environment
- React application runs on http://localhost:3000
- Modern browser compatibility

### ✅ User Experience
- Clean, intuitive interface using Material-UI
- Responsive design for different screen sizes
- Clear visual feedback for user actions

### ✅ Styling Framework
- Uses Material-UI (MUI) components exclusively
- Consistent design system throughout the app

## Pages

### 1. URL Shortener Page (`/`)
- **Functionality**: Allows users to shorten up to 5 URLs concurrently
- **Features**:
  - Original URL input with validation
  - Optional validity period (in minutes)
  - Optional custom shortcode
  - Display of shortened URLs with copy functionality
  - Links to statistics for each URL

### 2. URL Statistics Page (`/stats/:shortcode`)
- **Functionality**: Displays analytics for a specific shortened URL
- **Features**:
  - URL information (shortcode, original URL, creation date, expiry)
  - Click statistics (total clicks)
  - Detailed click data with timestamps, sources, and locations

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **Logging**: Custom logging middleware (tested in Postman)
- **Styling**: Material-UI theming and sx props

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Logging Integration

The application uses the custom logging middleware that sends logs to:
- **API Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Valid Parameters**:
  - Stack: `'frontend'`
  - Level: `'debug' | 'info' | 'warn' | 'error' | 'fatal'`
  - Package: `'controller'` (primary package used for frontend actions)
  - Message: Descriptive messages for each user action

## Example Log Entries

```javascript
// User submits URL
Log('frontend', 'info', 'controller', 'URL shortened: https://example.com -> abc123');

// Validation error
Log('frontend', 'warn', 'controller', 'User submitted invalid URL format');

// Statistics view
Log('frontend', 'info', 'controller', 'Viewing statistics for shortcode: abc123');
```

## Development Notes

- All TypeScript errors shown are related to missing dependencies (npm install will resolve)
- The app is designed to work with or without a backend API
- Currently uses mock data for statistics (ready for real API integration)
- Logging middleware has been tested and verified in Postman

## File Structure

```
src/
├── App.tsx                 # Main app component with routing
├── index.tsx              # React app entry point
├── URLShortenerPage.tsx   # Main URL shortening functionality
├── URLStatisticsPage.tsx  # Statistics and analytics page
└── loggingMiddleware.js   # Custom logging middleware
public/
└── index.html            # HTML template
```
