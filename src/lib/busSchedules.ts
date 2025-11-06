export interface BusSchedule {
  busNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  stops: string[];
  frequency: string;
}

export const busSchedules: BusSchedule[] = [
  {
    busNumber: 'VVCE-01',
    route: 'Campus to City',
    departureTime: '16:00',
    arrivalTime: '16:15',
    stops: ['Campus Gate', 'Main Road', 'Market', 'City Bus Stand'],
    frequency: 'Every hour'
  },
  {
    busNumber: 'VVCE-02',
    route: 'Campus to City',
    departureTime: '17:00',
    arrivalTime: '17:20',
    stops: ['Campus Gate', 'R-GATE'],
    frequency: 'Every hour'
  },
  {
    busNumber: 'VVCE-03',
    route: 'Campus to City',
    departureTime: '18:00',
    arrivalTime: '18:15',
    stops: ['Campus Gate', 'Mall Road', 'Sabar Bus Stand'],
    frequency: 'Every hour'
  },
 
];

// Mock weather delay calculation
export function getWeatherDelay(weather: { condition: string; temp: number }): { delay: number; reason: string } {
  const month = new Date().getMonth();
  const isRainySeason = month >= 5 && month <= 9; // Jun-Oct
  
  if (isRainySeason || weather.condition.toLowerCase().includes('rain')) {
    return {
      delay: 5,
      reason: 'Heavy rain expected - buses may be delayed by 5-10 minutes'
    };
  } else if (weather.condition.toLowerCase().includes('fog')) {
    return {
      delay: 3,
      reason: 'Foggy conditions - buses may be delayed by 3-5 minutes'
    };
  } else if (weather.temp > 35) {
    return {
      delay: 2,
      reason: 'High traffic due to heat - minor delays possible'
    };
  }
  
  return {
    delay: 0,
    reason: 'Normal weather conditions - buses running on time'
  };
}

export function calculateArrivalTime(schedule: BusSchedule, delay: number): string {
  const [hours, minutes] = schedule.arrivalTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + delay;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}
