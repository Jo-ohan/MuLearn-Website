import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageTransitionProvider } from './components/PageTransition';

// Route-level code splitting: each page ships as its own chunk.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const Team = lazy(() => import('./pages/Team'));
const Join = lazy(() => import('./pages/Join'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="team" element={<Team />} />
            <Route path="join" element={<Join />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </PageTransitionProvider>
    </BrowserRouter>
  );
}
