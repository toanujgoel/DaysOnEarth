import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { UserData, StatResults } from '../types';

interface ChatbotProps {
  initialContext: UserData & StatResults;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" /></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
);


export const Chatbot: React.FC<ChatbotProps> = ({ initialContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY not set");
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contextString = `This user was born on ${initialContext.birthdate} in ${initialContext.country}. They have lived for ${initialContext.daysLived} days. Here are some of their stats: ${JSON.stringify(initialContext)}. Your name is Astro. Be a helpful and insightful assistant.`;
    
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: contextString,
      },
    });
    
    setMessages([{ sender: 'bot', text: "Hello! I'm Astro. Ask me anything about your journey or how you can make a positive impact." }]);

  }, [initialContext]);
  
  useEffect(() => {
    if (isOpen) {
        initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || !chatRef.current) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessageStream({ message: input });
      let botResponseText = '';
      for await (const chunk of response) {
        botResponseText += chunk.text;
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.sender === 'bot') {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...lastMessage, text: botResponseText };
                return newMessages;
            }
            return [...prev, { sender: 'bot', text: botResponseText }];
        });
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-accent text-brand-dark-green rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        aria-label="Toggle Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-brand-forest rounded-xl shadow-2xl flex flex-col border border-brand-moss/50 animate-fade-in-up">
          <header className="p-4 border-b border-brand-moss/50">
            <h3 className="font-bold text-lg text-brand-light-green">Chat with Astro</h3>
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                   {msg.sender === 'bot' && <div className="bg-brand-moss rounded-full p-1 text-brand-light-green"><BotIcon /></div>}
                  <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-accent text-brand-dark-green' : 'bg-brand-moss text-brand-light-green'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                   {msg.sender === 'user' && <div className="bg-brand-stone rounded-full p-1 text-brand-dark-green"><UserIcon /></div>}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="bg-brand-moss rounded-full p-1 text-brand-light-green"><BotIcon /></div>
                    <div className="p-3 rounded-lg bg-brand-moss text-brand-light-green">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-brand-light-green rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-brand-light-green rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-brand-light-green rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-brand-moss/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-brand-dark-green border border-brand-moss rounded-full py-2 px-4 text-brand-light-green focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-brand-accent text-brand-dark-green rounded-full p-3 disabled:bg-brand-moss">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};