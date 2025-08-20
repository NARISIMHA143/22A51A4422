import { Router } from 'express';
import { createShortUrl, redirectToOriginalUrl, getUrlStats, getAllUrlStats } from '../controllers/url.controller';

const router = Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls', getAllUrlStats);
router.get('/shorturls/:shortcode', getUrlStats);
router.get('/:shortcode', redirectToOriginalUrl);

export { router as urlRoutes };