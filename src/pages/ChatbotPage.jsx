import { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Olá! Eu sou a Tonha, sua assistente de IA para tudo sobre futebol feminino. Como posso te ajudar hoje?' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getGeminiResponse = async (chatHistory) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = 'Aja como Tonha, uma assistente de IA amigável e especialista em futebol feminino. Suas respostas devem ser curtas e objetivas, com no máximo 3 frases. Foque sempre no universo do futebol praticado por mulheres. Não use markdown em suas respostas.';
        const contents = chatHistory.map((msg) => ({
            role: msg.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        }));
        const payload = { contents, systemInstruction: { parts: [{ text: systemPrompt }] }, tools: [{ google_search: {} }] };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { throw new Error(`API error: ${response.status} ${response.statusText}`); }
            const result = await response.json();
            const botText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            return botText || 'Desculpe, não consegui encontrar uma resposta. Pode tentar perguntar de outra forma?';
        } catch (error) {
            console.error('Erro ao chamar a API do Gemini:', error);
            return 'Ops! Tive um problema para me conectar. Por favor, tente novamente em alguns instantes.';
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' || isLoading) return;
        const userMessage = { sender: 'user', text: inputValue };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        const botResponseText = await getGeminiResponse(newMessages);
        const botResponse = { sender: 'bot', text: botResponseText };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        setIsLoading(false);
    };

    return (
        <div className="h-dvh w-screen bg-[var(--bg-color)] flex flex-col pt-16 pb-24 md:hidden">
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 bg-[var(--bg-color2)] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot size={20} className="text-gray-300" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[var(--primary-color)] text-white rounded-br-none' : 'bg-[var(--bg-color2)] text-gray-200 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 bg-[var(--bg-color2)] rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot size={20} className="text-gray-300" />
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
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--bg-color2)] bg-[var(--bg-color)]">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Pergunte sobre futebol feminino..."
                        className="w-full pl-4 pr-12 py-3 bg-[var(--bg-color2)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--primary-color)] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:brightness-110"
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

export default ChatbotPage;