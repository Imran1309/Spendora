const IS_PRODUCTION = !__DEV__; // Automatically true when built for production

// Replace 'your-app-name' with your actual Render service name after deployment
const RENDER_URL = 'https://spendora-backend.onrender.com'; 
const LOCAL_URL = 'http://10.25.198.38:5000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || (IS_PRODUCTION ? RENDER_URL : LOCAL_URL);
