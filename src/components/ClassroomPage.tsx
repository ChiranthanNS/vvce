import { useState, useEffect } from 'react';
import { supabase, Classroom, TimetableSlot } from '../lib/supabase';
import { Upload, Search, Clock, User, BookOpen, Building } from 'lucide-react';

interface ClassroomWithSlots extends Classroom {
  currentSlot?: TimetableSlot;
  isOccupied: boolean;
}

export default function ClassroomPage() {
  const [classrooms, setClassrooms] = useState<ClassroomWithSlots[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    roomNumber: '',
    dayOfWeek: 'monday',
    startTime: '',
    endTime: '',
    department: '',
    semester: '',
    courseName: '',
    professorName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classroomsRes, slotsRes] = await Promise.all([
        supabase.from('classrooms').select('*').order('room_number'),
        supabase.from('timetable_slots').select('*')
      ]);

      if (classroomsRes.error) throw classroomsRes.error;
      if (slotsRes.error) throw slotsRes.error;

      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5);

      const classroomsWithStatus = (classroomsRes.data || []).map(classroom => {
        const currentSlot = (slotsRes.data || []).find(slot => {
          const matchesRoom = slot.classroom_id === classroom.id;
          const matchesDay = slot.day_of_week.toLowerCase() === currentDay;
          const isInTimeRange = slot.start_time <= currentTime && slot.end_time >= currentTime;
          return matchesRoom && matchesDay && isInTimeRange;
        });

        return {
          ...classroom,
          currentSlot,
          isOccupied: !!currentSlot
        };
      });

      setClassrooms(classroomsWithStatus);
      setTimetableSlots(slotsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTimetable = async () => {
    try {
      const classroom = classrooms.find(c => c.room_number === uploadData.roomNumber);
      if (!classroom) {
        alert('Classroom not found');
        return;
      }

      const { error } = await supabase
        .from('timetable_slots')
        .insert([{
          classroom_id: classroom.id,
          day_of_week: uploadData.dayOfWeek,
          start_time: uploadData.startTime,
          end_time: uploadData.endTime,
          department: uploadData.department,
          semester: uploadData.semester,
          course_name: uploadData.courseName,
          professor_name: uploadData.professorName
        }]);

      if (error) throw error;

      alert('Timetable slot added successfully!');
      setShowUpload(false);
      setUploadData({
        roomNumber: '',
        dayOfWeek: 'monday',
        startTime: '',
        endTime: '',
        department: '',
        semester: '',
        courseName: '',
        professorName: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error uploading timetable:', error);
      alert('Error adding timetable slot');
    }
  };

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.currentSlot?.professor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.currentSlot?.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableClassrooms = filteredClassrooms.filter(c => !c.isOccupied);
  const occupiedClassrooms = filteredClassrooms.filter(c => c.isOccupied);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-green-600">Loading classrooms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Classroom Availability</h2>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 font-medium"
          >
            <Upload className="w-5 h-5" />
            Add Timetable
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by room, building, professor, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Classrooms</p>
                <p className="text-3xl font-bold text-green-600">{availableClassrooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupied Classrooms</p>
                <p className="text-3xl font-bold text-red-600">{occupiedClassrooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-green-600 mb-3">Available Now</h3>
          {availableClassrooms.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <p className="text-gray-500">No classrooms available right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableClassrooms.map(classroom => (
                <div key={classroom.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{classroom.room_number}</h4>
                      <p className="text-sm text-gray-600">{classroom.building}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      Capacity: {classroom.capacity} students
                    </div>
                    {classroom.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {classroom.facilities.map((facility, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {facility}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-red-600 mb-3">Currently Occupied</h3>
          {occupiedClassrooms.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <p className="text-gray-500">All classrooms are available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {occupiedClassrooms.map(classroom => (
                <div key={classroom.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{classroom.room_number}</h4>
                      <p className="text-sm text-gray-600">{classroom.building}</p>
                    </div>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Occupied
                    </span>
                  </div>
                  {classroom.currentSlot && (
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">{classroom.currentSlot.course_name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {classroom.currentSlot.professor_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {classroom.currentSlot.start_time} - {classroom.currentSlot.end_time}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          {classroom.currentSlot.department}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {classroom.currentSlot.semester}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add Timetable Slot</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={uploadData.roomNumber}
                    onChange={(e) => setUploadData({ ...uploadData, roomNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                  <select
                    value={uploadData.dayOfWeek}
                    onChange={(e) => setUploadData({ ...uploadData, dayOfWeek: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={uploadData.startTime}
                    onChange={(e) => setUploadData({ ...uploadData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={uploadData.endTime}
                    onChange={(e) => setUploadData({ ...uploadData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={uploadData.department}
                    onChange={(e) => setUploadData({ ...uploadData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <input
                    type="text"
                    value={uploadData.semester}
                    onChange={(e) => setUploadData({ ...uploadData, semester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Semester 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    value={uploadData.courseName}
                    onChange={(e) => setUploadData({ ...uploadData, courseName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professor Name</label>
                  <input
                    type="text"
                    value={uploadData.professorName}
                    onChange={(e) => setUploadData({ ...uploadData, professorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>
              <button
                onClick={handleUploadTimetable}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-all"
              >
                Add Timetable Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
