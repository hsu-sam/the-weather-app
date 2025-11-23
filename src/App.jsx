import { BrowserRouter, Route, Routes } from 'react-router';
import { WeatherProvider } from './context/WeatherContext';
import Home from './pages/Home';
import AppLayout from './ui/AppLayout';
import Insights from './pages/Insights';
import PageNotFound from './ui/PageNotFound';

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="insights" element={<Insights />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
