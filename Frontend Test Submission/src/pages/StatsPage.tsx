import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getAllStatsApi } from '../api/shortenerApi';

// This is where you will build the page to display stats
export function StatsPage() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAllStatsApi();
                setStats(response.data);
                // TODO: Log success
            } catch (error) {
                console.error("Failed to fetch stats", error);
                // TODO: Log failure
            }
        };
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>URL Statistics</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Short Link</TableCell>
                            <TableCell>Original URL</TableCell>
                            <TableCell>Clicks</TableCell>
                            <TableCell>Expires</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.map((stat) => (
                            <TableRow key={stat.shortcode}>
                                <TableCell><a href={stat.shortLink} target="_blank">{stat.shortLink}</a></TableCell>
                                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.originalUrl}</TableCell>
                                <TableCell>{stat.clickCount}</TableCell>
                                <TableCell>{new Date(stat.expiryDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}