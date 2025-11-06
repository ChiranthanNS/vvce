import { useState } from 'react';
import Navigation from './components/Navigation';
import CanteenPage from './components/CanteenPage';
import ClassroomPage from './components/ClassroomPage';
import BusTrackingPage from './components/BusTrackingPage';
import LoginPage from './components/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'canteen' | 'classroom' | 'bus'>('canteen');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <LoginPage
        onAuthenticate={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>
        {currentPage === 'canteen' && <CanteenPage />}
        {currentPage === 'classroom' && <ClassroomPage />}
        {currentPage === 'bus' && <BusTrackingPage />}
      </main>
    </div>
  );
}

export default App;
