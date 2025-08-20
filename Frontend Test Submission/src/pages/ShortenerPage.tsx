import { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { createShortUrlApi } from '../api/shortenerApi';

// This is where you will build your UI to shorten links
export function ShortenerPage() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        try {
            // TODO: Add client-side validation
            const response = await createShortUrlApi(originalUrl);
            setResult(response.data);
            // TODO: Use your logger function here for success
        } catch (error) {
            console.error("Failed to shorten URL", error);
            // TODO: Use your logger function here for failure
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Create a Short URL</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                    fullWidth
                    label="Enter a long URL"
                    variant="outlined"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit} sx={{ whiteSpace: 'nowrap' }}>
                    Shorten URL
                </Button>
            </Box>

            {result && (
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography>Short Link Created!</Typography>
                        <Typography>Link: <a href={result.shortLink} target="_blank">{result.shortLink}</a></Typography>
                        <Typography>Expires: {new Date(result.expiryDate).toLocaleString()}</Typography>                    </CardContent>
                </Card>
            )}
        </Box>
    );
}