import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle, Home, DollarSign, MapPin } from 'lucide-react';
import { ChatMessage, Property } from '../../types';
import { propertiesService } from '../../services/propertiesService';
import { Button } from '../ui/Button';
import { PropertyCard } from '../property/PropertyCard';

interface ChatbotProps {
  onPropertySelect?: (property: Property) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onPropertySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '¡Hola! Soy HogarIA, tu asistente inmobiliario inteligente. ¿En qué puedo ayudarte hoy? Puedo ayudarte a encontrar propiedades, responder preguntas sobre el mercado inmobiliario o darte consejos.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectFrustration = (text: string): boolean => {
    const frustrationKeywords = [
      'frustrado', 'molesto', 'enojado', 'ayuda urgente', 'no funciona',
      'problema', 'error', 'mal', 'terrible', 'horrible', 'no sirve'
    ];
    return frustrationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  };

  const processMessage = async (text: string): Promise<ChatMessage[]> => {
    const responses: ChatMessage[] = [];
    const lowerText = text.toLowerCase();

    // Detect frustration
    if (detectFrustration(text)) {
      responses.push({
        id: Date.now().toString(),
        text: '😔 Entiendo tu frustración. Permíteme conectarte con uno de nuestros agentes especializados que podrá ayudarte de manera personalizada. Mientras tanto, ¿puedes contarme específicamente qué tipo de propiedad estás buscando?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
      return responses;
    }

    // Property search patterns
    if (lowerText.includes('busco') || lowerText.includes('quiero') || lowerText.includes('necesito')) {
      let searchFilters: any = {};
      
      // Extract property type
      if (lowerText.includes('casa') || lowerText.includes('casas')) {
        searchFilters.type = 'house';
      } else if (lowerText.includes('apartamento') || lowerText.includes('departamento')) {
        searchFilters.type = 'apartment';
      } else if (lowerText.includes('oficina')) {
        searchFilters.type = 'office';
      }

      // Extract operation
      if (lowerText.includes('venta') || lowerText.includes('comprar')) {
        searchFilters.operation = 'sale';
      } else if (lowerText.includes('alquiler') || lowerText.includes('alquilar') || lowerText.includes('rentar')) {
        searchFilters.operation = 'rent';
      }

      // Extract bedrooms
      const bedroomMatch = text.match(/(\d+)\s*(habitacion|dormitorio|cuarto)/i);
      if (bedroomMatch) {
        searchFilters.minBedrooms = parseInt(bedroomMatch[1]);
      }

      // Extract cities
      const cities = ['new york', 'los angeles', 'chicago', 'miami', 'san francisco'];
      const foundCity = cities.find(city => lowerText.includes(city));
      if (foundCity) {
        searchFilters.city = foundCity.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }

      try {
        const properties = await propertiesService.getProperties(searchFilters);
        
        if (properties.length > 0) {
          responses.push({
            id: Date.now().toString(),
            text: `¡Perfecto! Encontré ${properties.length} propiedades que podrían interesarte. Aquí tienes algunas opciones:`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          });

          responses.push({
            id: (Date.now() + 1).toString(),
            text: '',
            sender: 'bot',
            timestamp: new Date(),
            type: 'properties',
            data: properties.slice(0, 3)
          });
        } else {
          responses.push({
            id: Date.now().toString(),
            text: 'No encontré propiedades exactas con esos criterios, pero déjame sugerirte algunas opciones similares que podrían interesarte.',
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          });
        }
      } catch (error) {
        responses.push({
          id: Date.now().toString(),
          text: 'Disculpa, tuve un problema al buscar propiedades. ¿Podrías intentar de nuevo?',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        });
      }
    }
    // Price inquiries
    else if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('cuanto')) {
      responses.push({
        id: Date.now().toString(),
        text: 'Los precios varían según la ubicación, tipo de propiedad y características. En nuestra plataforma tenemos propiedades desde $100,000 hasta más de $1,000,000. ¿Tienes un rango de precio en mente? ¿Qué tipo de propiedad te interesa?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Location inquiries
    else if (lowerText.includes('ubicacion') || lowerText.includes('zona') || lowerText.includes('donde')) {
      responses.push({
        id: Date.now().toString(),
        text: 'Tenemos propiedades en las mejores ubicaciones: New York (Manhattan, SoHo), Los Angeles (Beverly Hills, Arts District), Chicago, Miami, y San Francisco. ¿Hay alguna ciudad o zona específica que te interese?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // General greetings
    else if (lowerText.includes('hola') || lowerText.includes('buenos') || lowerText.includes('buenas')) {
      responses.push({
        id: Date.now().toString(),
        text: '¡Hola! Me da mucho gusto saludarte. Soy HogarIA y estoy aquí para ayudarte a encontrar la propiedad perfecta. ¿Qué tipo de propiedad estás buscando? ¿Para compra o alquiler?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Help requests
    else if (lowerText.includes('ayuda') || lowerText.includes('ayudar')) {
      responses.push({
        id: Date.now().toString(),
        text: 'Por supuesto, estoy aquí para ayudarte. Puedo asistirte con:\n\n🏠 Búsqueda de propiedades\n💰 Información de precios\n📍 Ubicaciones disponibles\n📋 Características de propiedades\n👥 Contacto con agentes\n\n¿Con qué te gustaría empezar?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Default response
    else {
      const defaultResponses = [
        'Interesante. ¿Podrías contarme más detalles sobre lo que buscas? Por ejemplo, ¿prefieres casa o apartamento?',
        'Entiendo. Para ayudarte mejor, ¿me podrías decir en qué ciudad te gustaría vivir?',
        'Perfecto. ¿Tienes algún rango de precio en mente para tu búsqueda?',
        'Me parece bien. ¿Cuántas habitaciones necesitarías en tu nueva propiedad?'
      ];
      
      responses.push({
        id: Date.now().toString(),
        text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }

    return responses;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponses = await processMessage(inputText);
      setMessages(prev => [...prev, ...botResponses]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: 'Busco casa en venta', icon: Home },
    { text: 'Apartamentos en alquiler', icon: Home },
    { text: 'Información de precios', icon: DollarSign },
    { text: 'Mejores ubicaciones', icon: MapPin }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">HogarIA Asistente</h3>
            <p className="text-xs text-blue-100">Tu asistente inmobiliario</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-100 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.type === 'properties' && message.data ? (
                    <div className="space-y-3">
                      {message.data.map((property: Property) => (
                        <div key={property.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex space-x-3">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{property.title}</h4>
                              <p className="text-xs text-gray-500">{property.city}</p>
                              <p className="text-sm font-semibold text-blue-600">
                                ${property.price.toLocaleString()}
                              </p>
                              <button
                                onClick={() => onPropertySelect?.(property)}
                                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                              >
                                Ver detalles →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Acciones rápidas:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action.text)}
                className="flex items-center space-x-1 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <action.icon className="h-3 w-3 text-gray-500" />
                <span className="text-gray-700">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            variant="primary"
            size="sm"
            icon={Send}
          >
          </Button>
        </div>
      </div>
    </div>
  );
};