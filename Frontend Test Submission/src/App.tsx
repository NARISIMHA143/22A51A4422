import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShortenerPage } from './pages/ShortenerPage';
import { StatsPage } from './pages/StatsPage';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}
export default App;