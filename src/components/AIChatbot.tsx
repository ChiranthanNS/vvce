import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  context: string;
}

const GEMINI_MODEL_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

export default function AIChatbot({ context }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi there! I\'m Zero, your friendly VVCE campus assistant! I\'m here to help you with everything on campus - from finding the perfect meal at the canteen, checking classroom availability, tracking buses, to answering any questions about campus life. I know all the details about our app and I\'m excited to help you out! What can I assist you with today? 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKeyFromEnv = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setGeminiError(null);

    try {
      const assistantMessage: Message = {
        role: 'assistant',
        content: await generateAIResponse({
          input,
          context,
          messages,
          apiKey: apiKeyFromEnv,
          onError: setGeminiError
        }),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error while generating response:', error);
      const fallbackMessage: Message = {
        role: 'assistant',
        content: generateRuleBasedResponse(input, context),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all z-50 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Zero - Your Campus Assistant</h3>
                <p className="text-xs opacity-90">I know everything about VVCE campus! 🌟</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {geminiError && (
            <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-4 py-3 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span>{geminiError}</span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Rule-based fallback responses when no API key is provided
function generateRuleBasedResponse(input: string, _context: string): string {
  const lowerInput = input.toLowerCase();

  // Greetings
  if (lowerInput.match(/^(hi|hello|hey|hola|good morning|good afternoon|good evening)$/)) {
    return 'Hey there! 👋 I\'m Zero, your VVCE campus assistant. How can I help you today? Feel free to ask me about buses, canteen, classrooms, or anything else! 😊';
  }

  // Bus-related queries
  if (lowerInput.includes('bus') && (lowerInput.includes('when') || lowerInput.includes('time') || lowerInput.includes('arrive'))) {
    return 'Hey! Let me check the bus schedule for you 🚌\n\n📍 Bus 1 (VVCE-01): Leaves at 4:00 PM, arrives 4:15 PM\n📍 Bus 2 (VVCE-02): Leaves at 5:00 PM, arrives 5:20 PM\n📍 Bus 3 (VVCE-03): Leaves at 6:00 PM, arrives 6:15 PM\n📍 Bus 4 (VVCE-04): Leaves at 7:00 PM, arrives 7:20 PM\n\nNote: Times might vary a bit due to weather. Check the Bus Tracking page for live updates! Need anything else? 😊';
  }

  if (lowerInput.includes('bus') && lowerInput.includes('delay')) {
    return 'Good question! Weather can definitely affect bus timings. Right now, all buses are running smoothly on schedule. For real-time updates with any weather-based delays, head over to the Bus Tracking page - it shows live delay info! 🌦️';
  }

  // Order-related queries
  if (lowerInput.includes('order') && (lowerInput.includes('placed') || lowerInput.includes('status'))) {
    return 'Your order has been successfully placed! 🎉\n\nYou can view your order details in your order history. If you have a specific order ID, I can help you track it. The canteen will notify you when your order is ready for pickup.';
  }

  // Canteen-related queries
  if (lowerInput.includes('special') || lowerInput.includes('today') || lowerInput.includes('dish')) {
    return '🍽️ Today\'s Specials at the canteen:\n\n⭐ Chef\'s Special: Paneer Butter Masala - ₹80\n🔥 Hot Favorite: Chicken Biryani - ₹120\n☕ Morning Special: Masala Dosa - ₹50\n🌟 Most Selling: Veg Fried Rice - ₹70\n\nBusy Hours: 12:00 PM - 2:00 PM & 5:00 PM - 7:00 PM\nEstimated wait time: 10-15 minutes\n\nWant to order something? Head to the Canteen page! 😊';
  }

  if (lowerInput.includes('weather') && lowerInput.includes('food')) {
    const season = (new Date().getMonth() >= 10 || new Date().getMonth() <= 2) ? 'winter' : 'summer';
    
    if (season === 'winter') {
      return '🌨️ Perfect weather for hot comfort food!\n\nRecommended items:\n🍜 Hot Soup - ₹40\n☕ Masala Tea - ₹15\n🍲 Chicken Curry with Roti - ₹90\n🔥 Maggi (Hot) - ₹35';
    } else {
      return '☀️ Beat the heat with these refreshing options!\n\nRecommended items:\n🥤 Fresh Juice - ₹30\n🍦 Ice Cream - ₹25\n🥗 Fresh Salad - ₹45\n🍹 Cold Coffee - ₹40';
    }
  }

  if (lowerInput.includes('breakfast') || (lowerInput.includes('morning') && lowerInput.includes('food'))) {
    return '🌅 Breakfast Suggestions (Available 7 AM - 11 AM):\n\n🥞 Idli Vada - ₹40\n🍳 Masala Dosa - ₹50\n🥖 Bread Omelette - ₹35\n☕ Coffee/Tea - ₹15\n🥤 Fresh Juice - ₹30';
  }

  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('budget')) {
    return '💰 Food Items by Price Range:\n\n💵 Under ₹50:\n• Tea/Coffee - ₹15\n• Samosa - ₹20\n• Vada Pav - ₹25\n• Maggi - ₹35\n\n💵 ₹50-₹100:\n• Masala Dosa - ₹50\n• Fried Rice - ₹70\n• Paneer Butter Masala - ₹80\n\n💵 Above ₹100:\n• Chicken Biryani - ₹120\n• Full Meal Thali - ₹100';
  }

  if (lowerInput.includes('busy') || lowerInput.includes('wait')) {
    return '⏰ Canteen Busy Hours:\n\n🔴 Peak Hours (Long wait):\n• 12:00 PM - 2:00 PM: 15-20 min wait\n• 5:00 PM - 7:00 PM: 10-15 min wait\n\n🟢 Best Times (Minimal wait):\n• 10:00 AM - 11:30 AM: 5 min wait\n• 3:00 PM - 4:30 PM: 5 min wait\n• After 7:30 PM: 5 min wait';
  }

  // Classroom-related queries
  if (lowerInput.includes('classroom') || lowerInput.includes('available') || lowerInput.includes('free room')) {
    return 'Check the Classroom page for real-time availability! You can:\n\n✅ See which rooms are currently available\n📅 View timetables for occupied rooms\n🔍 Search by room number, building, or professor\n➕ Add timetable entries\n📝 Submit complaints or feedback';
  }

  // Who are you / name queries
  if (lowerInput.includes('who are you') || lowerInput.includes('your name') || lowerInput.includes('what is your name')) {
    return 'I\'m Zero! 👋 Your friendly AI assistant for VVCE campus. I\'m here to make your campus life easier by helping you with buses, canteen orders, classroom info, and pretty much anything you need around campus. Think of me as your digital campus buddy! 😊 How can I help you today?';
  }

  // General app info
  if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
    return 'Great question! I\'m Zero, and I can help you with lots of things! 🌟\n\n🍽️ **Canteen:**\n• Browse menu & today\'s specials\n• Place orders\n• Get food suggestions based on weather/time\n• Check busy hours & wait times\n\n🚌 **Bus Tracking:**\n• View all bus schedules\n• Check weather-based delays\n• Track live bus locations\n\n📚 **Classrooms:**\n• Check room availability\n• View timetables\n• Submit feedback or complaints\n\nJust ask me anything - I\'m here to help! 😊';
  }

  // Default response
  return `Hi! I\'m Zero, your VVCE campus assistant! 👋\n\nI\'m here to help you with everything campus-related. You can ask me about:\n\n✨ Bus schedules and live tracking\n✨ Canteen menu, specials & recommendations\n✨ Classroom availability & timetables\n✨ Order status & busy hours\n✨ Weather-based food suggestions\n✨ And much more!\n\nWhat would you like to know? I\'ve got all the details! 😊`;
}

async function generateAIResponse({
  input,
  context,
  messages,
  apiKey,
  onError,
}: {
  input: string;
  context: string;
  messages: Message[];
  apiKey?: string;
  onError: (message: string | null) => void;
}): Promise<string> {
  if (!apiKey) {
    onError('Gemini API key missing. Using built-in knowledge instead.');
    return generateRuleBasedResponse(input, context);
  }

  const conversationHistory = messages
    .slice(-6)
    .map(msg => `${msg.role === 'user' ? 'Student' : 'Zero'}: ${msg.content}`)
    .join('\n');

  try {
    const response = await fetch(`${GEMINI_MODEL_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Zero, a friendly and helpful AI assistant for VVCE Campus Management System.

Context about the application:
${context}

Recent conversation:
${conversationHistory || 'No previous messages. Start fresh.'}

Student question: ${input}

Provide a warm, concise answer using the context. Include specific details like prices, schedules, or status only when the context supports it.`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      onError(`Gemini error ${response.status}. Using built-in knowledge.`);
      return generateRuleBasedResponse(input, context);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('\n')
      .trim();

    if (text) {
      return text;
    }

    onError('Gemini responded without content. Using built-in knowledge.');
    return generateRuleBasedResponse(input, context);
  } catch (error) {
    console.error('Failed to reach Gemini:', error);
    onError('Gemini request failed. Falling back to built-in knowledge.');
    return generateRuleBasedResponse(input, context);
  }
}
