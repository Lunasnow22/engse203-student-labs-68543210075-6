import { Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewRequestPage from './pages/NewRequestPage.jsx';
import RequestDetailPage from './pages/RequestDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} /> // default route
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<AboutPage />} path="about" />
        <Route element={<NewRequestPage />} path="requests/new" />
        <Route element={<RequestDetailPage />} path="requests/:requestId" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
  // TODO 5A-CP02: เปลี่ยนเป็น <Routes> ที่มี AppLayout เป็นกรอบ
}

export default App;