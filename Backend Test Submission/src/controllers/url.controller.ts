import { Request, Response } from 'express';
import { logToServer } from '../../../Logging Middleware/src/logger';
import { nanoid } from 'nanoid';

// --- IMPORTANT: Get a NEW access token and paste it here ---
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXJpc2ltaGFndW50YW11a2thbGFAZ21haWwuY29tIiwiZXhwIjoxNzU1Njc0MzgwLCJpYXQiOjE3NTU2NzM0ODAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyY2ZmNDgxZC02YTFlLTRmMmItYmI5NS1iZTE1MzA2MGQxOTciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJndW50YW11a2thbGEgdmVua2F0YSBsYWtzaG1pIG5hcmlzaW1oYSIsInN1YiI6IjYyYTNmMDQxLWMwZWUtNGMzYi1iNDNmLWJkZmIyMzQzOWEzNCJ9LCJlbWFpbCI6Im5hcmlzaW1oYWd1bnRhbXVra2FsYUBnbWFpbC5jb20iLCJuYW1lIjoiZ3VudGFtdWtrYWxhIHZlbmthdGEgbGFrc2htaSBuYXJpc2ltaGEiLCJyb2xsTm8iOiIyMmE1MWE0NDIyIiwiYWNjZXNzQ29kZSI6IldxVXhUWCIsImNsaWVudElEIjoiNjJhM2YwNDEtYzBlZS00YzNiLWI0M2YtYmRmYjIzNDM5YTM0IiwiY2xpZW50U2VjcmV0IjoiRG1nWVdRamh5dUpZdXJQRyJ9.97bH-A18do7ZXiO_M_2X3IOCmaRFb7uq3GRf3fCXa00';

interface UrlData {
  originalUrl: string;
  shortcode: string;
  creationDate: Date;
  expiryDate: Date;
}
interface ClickData {
  timestamp: Date;
  source: string;
  location: string;
}

const urlMap = new Map<string, UrlData>();
const urlStats = new Map<string, ClickData[]>();

const generateUniqueShortcode = (): string => {
  let shortcode;
  do { shortcode = nanoid(6); } while (urlMap.has(shortcode));
  return shortcode;
};

export const createShortUrl = async (req: Request, res: Response) => {
  const { url: originalUrl, validity, shortcode: customShortcode } = req.body;

  if (!originalUrl) {
    await logToServer({ stack: 'backend', level: 'warn', package: 'handler', message: 'Create failed: originalUrl is missing' }, ACCESS_TOKEN);
    return res.status(400).json({ message: 'originalUrl is required' });
  }

  if (customShortcode && urlMap.has(customShortcode)) {
    await logToServer({ stack: 'backend', level: 'error', package: 'handler', message: `Shortcode collision: '${customShortcode}'` }, ACCESS_TOKEN);
    return res.status(409).json({ message: 'This custom shortcode is already in use.' });
  }

  const shortcode = customShortcode || generateUniqueShortcode();
  const creationDate = new Date();
  const validityMinutes = validity || 30;
  const expiryDate = new Date(creationDate.getTime() + validityMinutes * 60000);

  urlMap.set(shortcode, { originalUrl, shortcode, creationDate, expiryDate });
  urlStats.set(shortcode, []);

  const shortLink = `http://localhost:3001/${shortcode}`;
  await logToServer({ stack: 'backend', level: 'info', package: 'controller', message: `Created short link for ${originalUrl}` }, ACCESS_TOKEN);
  res.status(201).json({ shortLink, expiryDate: expiryDate.toISOString() });
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const data = urlMap.get(shortcode);

  if (!data) {
    await logToServer({ stack: 'backend', level: 'error', package: 'handler', message: `Redirect failed: shortcode '${shortcode}' not found` }, ACCESS_TOKEN);
    return res.status(404).send('Short URL not found.');
  }

  if (new Date() > data.expiryDate) {
    await logToServer({ stack: 'backend', level: 'warn', package: 'handler', message: `Redirect failed: shortcode '${shortcode}' expired` }, ACCESS_TOKEN);
    return res.status(410).send('This link has expired.');
  }

  const stats = urlStats.get(shortcode);
  if (stats) {
    stats.push({
      timestamp: new Date(),
      source: req.get('Referrer') || 'Direct',
      location: `IP: ${req.ip}`
    });
  }
  
  await logToServer({ stack: 'backend', level: 'info', package: 'controller', message: `Redirecting shortcode '${shortcode}'` }, ACCESS_TOKEN);
  res.redirect(302, data.originalUrl);
};

export const getUrlStats = async (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const urlData = urlMap.get(shortcode);
  if (!urlData) return res.status(404).json({ message: 'Shortcode not found' });

  const clickData = urlStats.get(shortcode);
  res.status(200).json({
    originalUrl: urlData.originalUrl,
    creationDate: urlData.creationDate.toISOString(),
    expiryDate: urlData.expiryDate.toISOString(),
    clickCount: clickData ? clickData.length : 0,
    detailedClicks: clickData || []
  });
};

export const getAllUrlStats = async (req: Request, res: Response) => {
    const allStats = Array.from(urlMap.values()).map(urlData => ({
        shortLink: `http://localhost:3001/${urlData.shortcode}`,
        ...urlData,
        clickCount: urlStats.get(urlData.shortcode)?.length || 0,
    }));
    res.status(200).json(allStats);
};