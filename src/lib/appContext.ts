// Application context data for AI Chatbot
export const APP_CONTEXT = `
VVCE Campus Management System

=== CANTEEN SYSTEM ===
Available Features:
- Browse menu items by category (breakfast, lunch, snacks, beverages)
- Add items to cart with quantity controls (+/- buttons)
- View nutritional information (calories and protein) for all items
- Place orders with Razorpay payment integration
- View today's specials, most selling items, and weather-based recommendations
- Check busy hours and estimated wait times
- Access order history to track past orders

Cart & Ordering Features:
- Smart quantity controls: Add items and adjust quantities with +/- buttons
- Works on all menu sections: regular menu, today's specials, most selling, weather-based items
- Real-time cart updates with total amount calculation
- Secure payment processing with Razorpay
- Order confirmation with pickup time and order reference

Busy Hours:
- Peak Times: 12:00 PM - 2:00 PM (15-20 min wait) and 5:00 PM - 7:00 PM (10-15 min wait)
- Best Times: 10:00 AM - 11:30 AM, 3:00 PM - 4:30 PM, After 7:30 PM (5 min wait)

Today's Specials:
- Chef's Special: Paneer Butter Masala - ₹80 (450 cal, 20g protein)
- Hot Favorite: Chicken Biryani - ₹120 (520 cal, 25g protein)

Most Selling Items:
- Veg Fried Rice - ₹70 (380 cal, 12g protein)
- Chicken Biryani - ₹120 (520 cal, 25g protein)

COMPLETE MENU WITH NUTRITIONAL INFO:

Breakfast (7 AM - 11 AM):
- Idli Vada: ₹40 (280 cal, 9g protein)
- Masala Dosa: ₹60 (320 cal, 8g protein)

Lunch & Dinner:
- Veg Fried Rice: ₹70 (380 cal, 12g protein)
- Chicken Biryani: ₹120 (520 cal, 25g protein)
- Paneer Butter Masala: ₹80 (450 cal, 20g protein)
- Veg Pulao: ₹80 (350 cal, 10g protein)

Snacks:
- Veg Sandwich: ₹50 (280 cal, 12g protein)
- Paneer Kathi Roll: ₹70 (420 cal, 18g protein)
- Crispy Corn Chaat: ₹55 (180 cal, 6g protein)
- Samosa: ₹20 (160 cal, 4g protein)
- Maggi: ₹35 (310 cal, 9g protein)

Beverages:
- Classic Cold Coffee: ₹65 (250 cal, 8g protein)
- Fresh Lime Soda: ₹40 (120 cal, 0g protein)
- Orange Sparkle Cooler: ₹45 (140 cal, 1g protein)
- Fresh Juice: ₹30 (110 cal, 1g protein)
- Ice Cream: ₹25 (200 cal, 4g protein)
- Masala Tea: ₹15 (80 cal, 2g protein)

Weather-based Recommendations:
Cold Weather: Hot Soup (₹40, 150 cal, 5g protein), Masala Tea (₹15, 80 cal, 2g protein)
Hot Weather: Fresh Juice (₹30, 110 cal, 1g protein), Ice Cream (₹25, 200 cal, 4g protein)

Time-based Recommendations:
Morning (7-11 AM): Breakfast items
Lunch (12-3 PM): Full meals, Biryani, Thali
Evening (4-7 PM): Snacks, Tea/Coffee
Dinner (7-10 PM): Full meals, Fried Rice

Price Ranges:
Under ₹50: Tea, Coffee, Samosa, Vada Pav, Maggi, Poha, Idli
₹50-₹100: Dosa, Fried Rice, Paneer dishes, Dal Tadka, Sandwiches
Above ₹100: Chicken Biryani, Full Thali

=== BUS TRACKING SYSTEM ===
🚌 Bus Schedules:
1. 🚌 Bus 1 (VVCE-01) - Campus to City Route:
   - Departure from Campus: 4:00 PM
   - Arrival at City Bus Stand: 4:15 PM
   - Stops: Campus Gate → Main Road → Market → City Bus Stand
   - Frequency: Every hour

2. 🚌 Bus 2 (VVCE-02) - Campus to City Route:
   - Departure from Campus: 5:00 PM
   - Arrival at City Bus Stand: 5:20 PM
   - Stops: Campus Gate → University Road → Railway Station → City Bus Stand
   - Frequency: Every hour

3. 🚌 Bus 3 (VVCE-03) - Campus to City Route:
   - Departure from Campus: 6:00 PM
   - Arrival at City Bus Stand: 6:15 PM
   - Stops: Campus Gate → Mall Road → Hospital → City Bus Stand
   - Frequency: Every hour

4. 🚌 Bus 4 (VVCE-04) - Campus to City Route:
   - Departure from Campus: 7:00 PM
   - Arrival at City Bus Stand: 7:20 PM
   - Stops: Campus Gate → Main Road → Market → City Bus Stand
   - Frequency: Every hour

Weather Impact on Buses:
- Heavy Rain: 5-10 minutes delay expected
- Fog/Mist: 3-5 minutes delay expected
- Normal Weather: On-time operation
- Traffic: Real-time updates on bus tracking page

Live tracking available with Google Maps integration showing real-time bus location.

=== CLASSROOM SYSTEM ===
Features:
- View real-time classroom availability
- Check which rooms are occupied and by whom
- Search by room number, building, professor, or course
- Add/update timetable slots
- Submit complaints or feedback

Sample Classrooms:
- Room 101, Main Building (Capacity: 60, Facilities: Projector, AC, Whiteboard)
- Room 201, Main Building (Capacity: 50, Facilities: Projector, Whiteboard)
- Lab 1, Lab Building (Capacity: 40, Facilities: Computers, AC, Projector)
- Auditorium, Admin Building (Capacity: 200, Facilities: Stage, AC, Sound System)

Timetable shows:
- Course name and professor
- Department and semester
- Time slots (start and end time)
- Day of the week

Users can submit complaints or comments about classrooms directly through the page.

=== ORDER TRACKING & HISTORY ===
Order Placement Process:
- Add items to cart using +/- quantity controls
- Proceed to checkout with student details (name, ID, pickup time)
- Secure payment via Razorpay integration
- Receive order confirmation with reference number
- Get estimated wait time and ready time

Order History Features:
- Access complete order history from canteen page
- View past orders with full details: items, quantities, prices, nutritional info
- Track order status: Confirmed → Preparing → Ready → Completed
- See payment status and order references
- Review pickup times and total amounts
- Filter orders by date or status

Order Information Includes:
- Student name and ID
- Items ordered with quantities and individual prices
- Nutritional information (total calories and protein)
- Total amount paid
- Pickup time selected
- Order reference number (e.g., ORD-001, ORD-002)
- Payment status (Paid/Pending)
- Order status updates
- Estimated wait time (15-20 minutes during peak hours)

Example Order Response:
"Your order has been placed successfully! 🎉
Order Reference: ORD-045
Items: 2x Masala Dosa (₹120, 640 cal, 16g protein), 1x Cold Coffee (₹65, 250 cal, 8g protein)
Total: ₹185 (890 calories, 24g protein)
Pickup Time: 1:30 PM
Estimated Wait: 15 minutes
Status: Confirmed
Payment: Completed via Razorpay
You will be notified when your order is ready!"

=== GENERAL INFO ===
Campus Location: VVCE, Mysuru, Karnataka
Operating Hours:
- Canteen: 7:00 AM - 10:00 PM
- Bus Service: 6:00 AM - 9:00 PM
- Classrooms: 8:00 AM - 8:00 PM

Student Support:
- For technical issues, contact IT support
- For canteen issues, contact canteen manager
- For bus issues, contact transport department
- For classroom issues, submit feedback through the system
`;

// Weather conditions (mock data - replace with actual weather API)
export function getCurrentWeather(): { temp: number; condition: string; suggestion: string } {
  const temp = 27;
  const isCold = temp <= 20;

  if (isCold) {
    return {
      temp,
      condition: 'Cold',
      suggestion: 'Perfect weather for hot food! Try our Hot Soup, Masala Tea, or Chicken Curry.'
    };
  } else {
    return {
      temp,
      condition: 'Warm',
      suggestion: 'Pleasant weather outside! Treat yourself to Fresh Juice, Ice Cream, or a Cold Coffee.'
    };
  }
}

// Time-based food suggestions
export function getTimeBasedSuggestions(): string[] {
  const hour = new Date().getHours();
  
  if (hour >= 7 && hour < 11) {
    return ['Idli Vada', 'Masala Dosa', 'Bread Omelette', 'Poha', 'Tea/Coffee'];
  } else if (hour >= 11 && hour < 15) {
    return ['Veg Fried Rice', 'Chicken Biryani', 'Paneer Butter Masala', 'Full Meal Thali'];
  } else if (hour >= 15 && hour < 19) {
    return ['Samosa', 'Vada Pav', 'Maggi', 'Sandwich', 'Tea/Coffee'];
  } else {
    return ['Veg Fried Rice', 'Chicken Biryani', 'Paneer dishes', 'Dal Tadka with Roti'];
  }
}

// Price range filtering
export function getItemsByPriceRange(maxPrice: number) {
  if (maxPrice <= 50) {
    return ['Tea/Coffee (₹15)', 'Samosa (₹20)', 'Vada Pav (₹25)', 'Maggi (₹35)', 'Idli Vada (₹40)'];
  } else if (maxPrice <= 100) {
    return ['Masala Dosa (₹50)', 'Dal Tadka (₹60)', 'Veg Fried Rice (₹70)', 'Paneer Butter Masala (₹80)', 'Full Thali (₹100)'];
  } else {
    return ['Chicken Biryani (₹120)', 'Special Thali (₹150)', 'Family Pack (₹200)'];
  }
}
