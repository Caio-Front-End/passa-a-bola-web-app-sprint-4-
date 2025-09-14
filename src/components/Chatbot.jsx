import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

// Componente principal do Chatbot
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá! Eu sou a Tonha, sua assistente de IA para tudo sobre futebol feminino. Como posso te ajudar hoje?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para chamar a API do Gemini
  const getGeminiResponse = async (userQuery) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const systemPrompt =
      'Aja como Tonha, uma assistente de IA amigável e especialista em futebol feminino. Suas respostas devem ser curtas e objetivas, com no máximo 3 frases. Foque sempre no universo do futebol praticado por mulheres. Não use markdown em suas respostas.';

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const botText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      return (
        botText ||
        'Desculpe, não consegui encontrar uma resposta. Pode tentar perguntar de outra forma?'
      );
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      return 'Ops! Tive um problema para me conectar. Por favor, tente novamente em alguns instantes.';
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const currentQuery = inputValue; // Guarda a pergunta antes de limpar o input
    setInputValue('');
    setIsLoading(true);

    // --- LÓGICA DA IA REAL ---
    const botResponseText = await getGeminiResponse(currentQuery);

    const botResponse = {
      sender: 'bot',
      text: botResponseText,
    };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="cursor-pointer fixed bottom-18 right-3 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-[#b554b5] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#d44b84] transition-transform hover:scale-110"
        aria-label="Abrir chat"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div
      className="
        fixed 
        bottom-13 right-0 sm:bottom-6 sm:right-6
        w-[95vw] sm:max-w-sm
        h-[70vh] max-h-[600px]
        bg-white dark:bg-gray-800
        rounded-t-lg sm:rounded-lg
        shadow-2xl
        flex flex-col font-sans
        transition-all duration-300 ease-out transform
        scale-95 opacity-0 animate-[fadeInUp_0.3s_ease-out_forwards]
      "
    >
      {/* Cabeçalho */}
      <header className="bg-[#b554b5] text-white p-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot size={24} />
          <h2 className="text-lg font-semibold">Tonha</h2>
        </div>
        <button
          onClick={toggleChat}
          className="hover:opacity-75"
          aria-label="Fechar chat"
        >
          <X size={24} />
        </button>
      </header>

      {/* Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#b554b5] text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-700">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Pergunte sobre futebol feminino..."
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#b554b5] text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#b554b5] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-[#d44b84]"
            disabled={isLoading || inputValue.trim() === ''}
            aria-label="Enviar mensagem"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
