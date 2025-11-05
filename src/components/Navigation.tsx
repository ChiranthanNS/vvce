import { UtensilsCrossed, DoorOpen, Bus } from 'lucide-react';

interface NavigationProps {
  currentPage: 'canteen' | 'classroom' | 'bus';
  onPageChange: (page: 'canteen' | 'classroom' | 'bus') => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-md border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-600">Student Portal</h1>
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <button
              onClick={() => onPageChange('canteen')}
              className={`flex flex-col sm:flex-row items-center px-3 sm:px-4 py-2 rounded-lg transition-all ${
                currentPage === 'canteen'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 sm:mr-2" />
              <span className="text-xs sm:text-base mt-1 sm:mt-0">Canteen</span>
            </button>
            <button
              onClick={() => onPageChange('classroom')}
              className={`flex flex-col sm:flex-row items-center px-3 sm:px-4 py-2 rounded-lg transition-all ${
                currentPage === 'classroom'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <DoorOpen className="w-5 h-5 sm:mr-2" />
              <span className="text-xs sm:text-base mt-1 sm:mt-0">Classrooms</span>
            </button>
            <button
              onClick={() => onPageChange('bus')}
              className={`flex flex-col sm:flex-row items-center px-3 sm:px-4 py-2 rounded-lg transition-all ${
                currentPage === 'bus'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <Bus className="w-5 h-5 sm:mr-2" />
              <span className="text-xs sm:text-base mt-1 sm:mt-0">Bus</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
