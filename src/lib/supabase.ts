const mockData: Record<string, any[]> = {
  canteen_items: [
    {
      id: '1',
      name: 'Veg Sandwich',
      description: 'Fresh vegetable sandwich with cheese',
      price: 50,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Masala Dosa',
      description: 'South Indian crispy dosa with potato filling',
      price: 60,
      category: 'breakfast',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Veg Pulao',
      description: 'Rice cooked with vegetables and spices',
      price: 80,
      category: 'lunch',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Paneer Kathi Roll',
      description: 'Spiced paneer wrapped in a soft paratha',
      price: 70,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Crispy Corn Chaat',
      description: 'Sweet corn tossed with spices and herbs',
      price: 55,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Classic Cold Coffee',
      description: 'Chilled coffee blended with milk and ice cream',
      price: 65,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '7',
      name: 'Fresh Lime Soda',
      description: 'Refreshing lemon soda served sweet or salty',
      price: 40,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '8',
      name: 'Orange Sparkle Cooler',
      description: 'Sparkling orange drink with a hint of mint',
      price: 45,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '9',
      name: 'Paneer Butter Masala',
      description: 'Chef\'s Special - Creamy paneer in rich tomato gravy',
      price: 80,
      category: 'lunch',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      is_special: true,
      is_today_special: true
    },
    {
      id: '10',
      name: 'Chicken Biryani',
      description: 'Hot Favorite - Aromatic rice with tender chicken',
      price: 120,
      category: 'lunch',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      is_special: true,
      is_best_seller: true
    },
    {
      id: '11',
      name: 'Hot Soup',
      description: 'Perfect for cold weather - Mixed veg soup',
      price: 40,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      weather_tag: 'cold'
    },
    {
      id: '12',
      name: 'Masala Tea',
      description: 'Hot and spicy tea blend',
      price: 15,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      weather_tag: 'cold'
    },
    {
      id: '13',
      name: 'Ice Cream',
      description: 'Beat the heat with vanilla ice cream',
      price: 25,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      weather_tag: 'hot'
    },
    {
      id: '14',
      name: 'Fresh Juice',
      description: 'Refreshing mixed fruit juice',
      price: 30,
      category: 'beverages',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      weather_tag: 'hot'
    },
    {
      id: '15',
      name: 'Idli Vada',
      description: 'Morning Special - Soft idli with crispy vada',
      price: 40,
      category: 'breakfast',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      time_tag: 'morning'
    },
    {
      id: '16',
      name: 'Veg Fried Rice',
      description: 'Most Selling - Tasty fried rice with vegetables',
      price: 70,
      category: 'lunch',
      available: true,
      image_url: '',
      created_at: new Date().toISOString(),
      is_best_seller: true
    },
    {
      id: '17',
      name: 'Samosa',
      description: 'Crispy pastry with spiced potato filling',
      price: 20,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
    {
      id: '18',
      name: 'Maggi',
      description: 'Classic instant noodles',
      price: 35,
      category: 'snacks',
      available: true,
      image_url: '',
      created_at: new Date().toISOString()
    },
  ],
  classrooms: [
    {
      id: '1',
      room_number: '101',
      building: 'Main Block',
      capacity: 60,
      facilities: ['Projector', 'AC', 'Whiteboard'],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      room_number: '102',
      building: 'Main Block',
      capacity: 40,
      facilities: ['Whiteboard'],
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      room_number: '201',
      building: 'CS Block',
      capacity: 30,
      facilities: ['Projector', 'Computers', 'Whiteboard'],
      created_at: new Date().toISOString()
    },
  ],
  timetable_slots: [
    {
      id: '1',
      classroom_id: '1',
      day_of_week: 'monday',
      start_time: '09:00',
      end_time: '10:30',
      department: 'Computer Science',
      semester: 'Semester 5',
      course_name: 'Data Structures',
      professor_name: 'Dr. Sharma',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      classroom_id: '2',
      day_of_week: 'monday',
      start_time: '11:00',
      end_time: '12:30',
      department: 'Electronics',
      semester: 'Semester 3',
      course_name: 'Digital Electronics',
      professor_name: 'Prof. Verma',
      created_at: new Date().toISOString()
    },
  ],
  bus_locations: [
    {
      id: '1',
      bus_number: 'VVCE-01',
      route_name: 'Campus to City',
      latitude: 12.335280,
      longitude: 76.618382,
      last_updated: new Date().toISOString(),
      is_active: true
    },
  ],
  orders: [],
};
export const supabase = {
  from: (table: string) => ({
    select: (_columns: string) => ({
      eq: (column: string, value: any) => ({
        maybeSingle: () => Promise.resolve({ data: mockData[table]?.find((item: any) => item[column] === value), error: null }),
        order: (_column: string) => Promise.resolve({ data: mockData[table], error: null }),
      }),
      order: (_column: string) => Promise.resolve({ data: mockData[table], error: null }),
    }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({
      eq: (_column: string, _value: any) => Promise.resolve({ data, error: null }),
    }),
  }),
};

export interface CanteenItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url: string;
  created_at: string;
  is_special?: boolean;
  is_today_special?: boolean;
  is_best_seller?: boolean;
  weather_tag?: 'hot' | 'cold';
  time_tag?: 'morning' | 'lunch' | 'evening' | 'dinner';
}

export interface Order {
  id: string;
  student_name: string;
  student_id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  pickup_time: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export interface Classroom {
  id: string;
  room_number: string;
  building: string;
  capacity: number;
  facilities: string[];
  created_at: string;
}

export interface TimetableSlot {
  id: string;
  classroom_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  department: string;
  semester: string;
  course_name: string;
  professor_name: string;
  created_at: string;
}

export interface BusLocation {
  id: string;
  bus_number: string;
  route_name: string;
  latitude: number;
  longitude: number;
  last_updated: string;
  is_active: boolean;
}
