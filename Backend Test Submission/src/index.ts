import express from 'express';
import cors from 'cors';
import { urlRoutes } from './routes/url.routes';
import { logToServer } from '../../Logging Middleware/src/logger';

// --- IMPORTANT: Get a NEW access token and paste it here ---
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXJpc2ltaGFndW50YW11a2thbGFAZ21haWwuY29tIiwiZXhwIjoxNzU1Njc0MzgwLCJpYXQiOjE3NTU2NzM0ODAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyY2ZmNDgxZC02YTFlLTRmMmItYmI5NS1iZTE1MzA2MGQxOTciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJndW50YW11a2thbGEgdmVua2F0YSBsYWtzaG1pIG5hcmlzaW1oYSIsInN1YiI6IjYyYTNmMDQxLWMwZWUtNGMzYi1iNDNmLWJkZmIyMzQzOWEzNCJ9LCJlbWFpbCI6Im5hcmlzaW1oYWd1bnRhbXVra2FsYUBnbWFpbC5jb20iLCJuYW1lIjoiZ3VudGFtdWtrYWxhIHZlbmthdGEgbGFrc2htaSBuYXJpc2ltaGEiLCJyb2xsTm8iOiIyMmE1MWE0NDIyIiwiYWNjZXNzQ29kZSI6IldxVXhUWCIsImNsaWVudElEIjoiNjJhM2YwNDEtYzBlZS00YzNiLWI0M2YtYmRmYjIzNDM5YTM0IiwiY2xpZW50U2VjcmV0IjoiRG1nWVdRamh5dUpZdXJQRyJ9.97bH-A18do7ZXiO_M_2X3IOCmaRFb7uq3GRf3fCXa00';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Backend URL Shortener is running on http://localhost:${PORT}`);
  logToServer({
    stack: 'backend',
    level: 'info',
    package: 'service',
    message: `Server successfully started on port ${PORT}`,
  }, ACCESS_TOKEN);
});