import React, { useState, useRef, useEffect } from 'react';

const HealthAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your PinkRoute Health Assistant.\nYou can ask me anything about periods, cramps, menstrual hygiene, or cycle concerns. Your questions are private.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    if (message.includes('cramp') || message.includes('pain')) {
      return "Period cramps are common! Here are some tips:\n\n✓ Apply heat (hot water bottle)\n✓ Stay hydrated\n✓ Light exercise like walking or yoga\n✓ Gentle massage\n✓ Over-the-counter pain relief\n✓ Rest when needed";
    }

    if (message.includes('late') || message.includes('missed') || message.includes('irregular')) {
      return "A late or irregular period can happen due to:\n\n• Stress or anxiety\n• Changes in weight or exercise\n• Sleep disruption\n• Diet changes\n• Hormonal imbalance\n\nIf your period is more than 2 weeks late, consult a doctor.";
    }

    if (message.includes('heavy') || message.includes('bleeding')) {
      return "Heavy menstrual bleeding tips:\n\n✓ Use tampons or pads more frequently\n✓ Eat iron-rich foods (spinach, beans)\n✓ Stay hydrated\n✓ Use menstrual cups\n\nConsult a doctor if extremely heavy.";
    }

    if (message.includes('hygiene') || message.includes('clean') || message.includes('wash')) {
      return "Menstrual hygiene tips:\n\n✓ Change pads every 4-6 hours\n✓ Wash hands before & after\n✓ Dispose pads safely\n✓ Wash with plain water\n✓ Avoid douching\n✓ Wear breathable undergarments";
    }

    if (message.includes('diet') || message.includes('food') || message.includes('eat')) {
      return "Good nutrition during your period:\n\n✓ Iron-rich foods: Red meat, spinach, lentils\n✓ Calcium: Milk, yogurt, cheese\n✓ Magnesium: Nuts, seeds, chocolate\n✓ Whole grains: Brown rice, oats\n✓ Stay hydrated: 8-10 glasses water";
    }

    if (message.includes('exercise') || message.includes('workout') || message.includes('sports')) {
      return "Exercise during your period is beneficial!\n\n✓ Light exercise reduces cramps\n✓ Walking, yoga, swimming are great\n✓ Stretching helps with pain\n✓ Listen to your body\n✓ Avoid heavy lifting on heavy days";
    }

    if (message.includes('mood') || message.includes('pms') || message.includes('emotional')) {
      return "PMS mood changes are common!\n\n✓ Track your cycle\n✓ Practice meditation\n✓ Exercise regularly\n✓ Get 7-8 hours sleep\n✓ Eat balanced meals\n✓ Talk to someone\n\nIf severe, consult a doctor.";
    }

    if (message.includes('pad') || message.includes('tampon') || message.includes('product')) {
      return "Period product options:\n\n📌 Pads: Easiest to use, various sizes\n🧴 Tampons: For sports/swimming\n🔵 Menstrual Cups: Reusable, eco-friendly\n💧 Period Underwear: Washable\n\nChoose what's comfortable for you!";
    }

    if (message.includes('period') || message.includes('menstruation') || message.includes('cycle')) {
      return "Your menstrual cycle:\n\n📅 Average: 28 days (21-35 is normal)\n🔴 Period lasts: 3-7 days\n\nWhat to expect:\n• Mild to moderate cramping\n• Mood changes\n• Bloating\n• Fatigue\n\nEvery person is different!";
    }

    return "I want to help! Could you explain your concern a little more?\n\nYou can ask about:\n• Cramps and period pain\n• Late or irregular periods\n• Heavy bleeding\n• Hygiene\n• Diet and exercise\n• PMS symptoms\n• Period products";
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(text);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500 + Math.random() * 1000);
  };

  const quickSuggestions = [
    { text: 'Cramps Help', emoji: '😣' },
    { text: 'Late Period', emoji: '📅' },
    { text: 'Heavy Bleeding', emoji: '🩸' },
    { text: 'Hygiene Tips', emoji: '🧼' }
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center text-2xl z-40"
          title="Open Health Assistant"
          style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
          style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, width: '380px', height: '600px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-t-2xl p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏥</div>
              <div>
                <h3 className="font-bold text-sm">PinkRoute Health Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl hover:opacity-80 transition flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-pink-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Quick answers:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion.text)}
                    className="text-xs bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 px-3 py-2 rounded-lg transition font-medium"
                  >
                    {suggestion.emoji} {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-2xl flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask about your period..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                💬
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            Your privacy matters. PinkRoute is a safe space.
          </div>
        </div>
      )}
    </>
  );
};

export default HealthAssistant;
