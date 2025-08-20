import axios from 'axios';

// The URL for the logging API endpoint
const LOGS_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Define the structure for the log parameters
interface LogPayload {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: string; // The package name, e.g., 'handler', 'db', 'component'
  message: string;
}

/**
 * Sends a log entry to the evaluation test server.
 * @param {LogPayload} payload - The log data to send.
 * @param {string} accessToken - The Bearer token for authorization.
 */
export async function logToServer(payload: LogPayload, accessToken: string): Promise<void> {
  // Validate that the access token is provided
  if (!accessToken) {
    console.error('Error: Access Token is missing. Cannot send log.');
    return;
  }

  try {
    // Make the POST request to the server
    const response = await axios.post(LOGS_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Set the authorization header
      },
    });

    // Log the success message from the server
    console.log('Log sent successfully:', response.data.message);

  } catch (error) {
    // Handle any errors that occur during the request
    if (axios.isAxiosError(error)) {
      console.error('Failed to send log:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}