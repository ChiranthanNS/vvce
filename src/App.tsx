import { useState } from 'react';
import Navigation from './components/Navigation';
import CanteenPage from './components/CanteenPage';
import ClassroomPage from './components/ClassroomPage';
import BusTrackingPage from './components/BusTrackingPage';
import LoginPage from './components/LoginPage';
import OrderHistoryPage from './components/OrderHistoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'canteen' | 'classroom' | 'bus' | 'history'>('canteen');
  const [pageHistory, setPageHistory] = useState<('canteen' | 'classroom' | 'bus' | 'history')[]>(['canteen']);
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

  const handlePageChange = (page: 'canteen' | 'classroom' | 'bus' | 'history') => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'history' && (
        <Navigation currentPage={currentPage as 'canteen' | 'classroom' | 'bus'} onPageChange={handlePageChange} />
      )}
      <main>
        {currentPage === 'canteen' && <CanteenPage onNavigateToHistory={() => handlePageChange('history')} onBack={handleBack} />}
        {currentPage === 'classroom' && <ClassroomPage onBack={handleBack} />}
        {currentPage === 'bus' && <BusTrackingPage onBack={handleBack} />}
        {currentPage === 'history' && <OrderHistoryPage onBack={handleBack} />}
      </main>
    </div>
  );
}

export default App;
