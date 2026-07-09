import { setBaseUrl } from '@workspace/api-client-react';
import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

// Point the API client at the backend server.
// VITE_API_URL should be the backend root URL with NO trailing slash
// and NO /api suffix — e.g. https://your-api.onrender.com
// The hooks already include the /api/... path prefix.
const apiUrl = import.meta.env['VITE_API_URL'] as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById('root')!).render(<App />);
