import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';

// Componente principal do Chatbot
export const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'E aí, tudo na paz? Sou a Tonha! Puxei o DNA da Alê Xavier e da Luana Maluf, então tô por dentro de TUDO do nosso futebol feminino. Manda a letra, qual a boa de hoje?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGeminiResponse = async (chatHistory) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-preview-0514:generateContent?key=${apiKey}`;

    const systemPrompt =
      "Aja como Tonha. Você é a 'filha' de Alê Xavier e Luana Maluf do Passa a Bola. Você cresceu nos bastidores do jornalismo esportivo e tem o futebol feminino correndo nas veias. Sua personalidade é uma mistura perfeita das suas 'mães': você é afiada, engraçada e usa gírias como a Alê, mas também é analítica e traz a informação precisa como a Luana. Responda de forma curta e direta, com um tom espirituoso e cheio de marra. Sempre que possível, mencione o legado ou o estilo de Alê e Luana. Use a busca do Google para trazer os dados mais quentes, como se tivesse acabado de receber a informação no ponto eletrônico. Se não souber algo, responda com confiança: 'Opa, essa informação ainda não chegou na minha bancada. Vou apurar e te conto!'";

    const contents = chatHistory.map((msg) => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      tools: [{ google_search: {} }],
      tool_config: {
        google_search: {
          mode: 'TOOL_MODE_ON',
        },
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const botResponseText = await getGeminiResponse(newMessages);

    const botResponse = {
      sender: 'bot',
      text: botResponseText,
    };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3, y: 80 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="
        fixed 
        bottom-22 left-1/2 -translate-x-1/2 
        sm:left-auto sm:bottom-6 sm:right-6 sm:translate-x-0 
        w-[95vw] sm:max-w-sm
        h-[70vh] max-h-[600px]
        bg-[var(--bg-color)]/40 backdrop-blur-md
        rounded-lg 
        sm:rounded-t-lg
        shadow-2xl
        flex flex-col font-sans
        z-50 border-2 border-gray-200/10
        origin-bottom
      "
    >
      {/* Cabeçalho */}
      <header className="bg-[var(--primary-color)] text-white p-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot size={24} />
          <h2 className="text-lg font-semibold">Tonha</h2>
        </div>
        <button
          onClick={onClose}
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
                <div className="w-8 h-8 bg-[var(--primary-color)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-[var(--primary-color)]" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[var(--primary-color)] text-white rounded-br-none'
                    : 'bg-[var(--bg-color2)] text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 bg-[var(--primary-color)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-[var(--primary-color)]" />
              </div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-[var(--bg-color2)]">
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
        className="p-4 border-t border-gray-700/50"
      >
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Manda a letra..."
            className="w-full pl-4 pr-12 py-3 bg-[var(--bg-color2)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--primary-color)] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-[var(--primary-color-hover)]"
            disabled={isLoading || inputValue.trim() === ''}
            aria-label="Enviar mensagem"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Chatbot;
