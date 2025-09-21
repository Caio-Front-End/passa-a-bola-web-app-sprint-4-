import React, { useState, useEffect, useRef } from 'react';
import introVideoHub from '../assets/intro-src/intro-video-hub.mp4';
import introVideoQuadras from '../assets/intro-src/intro-video-quadras.mp4';
import introVideoTonha from '../assets/intro-src/intro-video-tonha.mp4';
import introFotoFinta from '../assets/intro-src/intro-foto-finta.jpg';
import introFotoFinal from '../assets/intro-src/intro-foto-final.jpg';

const slidesData = [
    // Seus dados de slides (sem alterações)
    { type: 'video', src: introVideoHub, alt: 'Jogadoras em frente a um gol de futebol.', title: 'Um Hub só para você!', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { type: 'video', src: introVideoQuadras, alt: 'Mulher deitada na grama de um campo de futebol.', title: 'Encontre quadras!', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { type: 'video', src: introVideoTonha, title: 'Tire suas ideias com a tonha!', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
    { type: 'image', src: introFotoFinta, alt: 'Jogadora se preparando para chutar.', title: 'Publique e compartilhe!', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { type: 'image', src: introFotoFinal, alt: 'Jogadora correndo com a bola.', title: 'Voe mais alto!', description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' }
];

const IntroScreen = ({ onFinish }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRefs = useRef([]);
    const totalSlides = slidesData.length;

    useEffect(() => {
        videoRefs.current.forEach((videoEl, index) => {
            if (videoEl) {
                if (index === currentSlide && slidesData[index].type === 'video') {
                    videoEl.play().catch(error => console.log("Video play was prevented:", error));
                } else {
                    videoEl.pause();
                    videoEl.currentTime = 0;
                }
            }
        });
    }, [currentSlide]);

    const handleNext = () => currentSlide < totalSlides - 1 ? setCurrentSlide(currentSlide + 1) : onFinish();
    const handleSkip = () => onFinish();
    const handleDotClick = (index) => setCurrentSlide(index);

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0d0d0d] flex flex-col text-white md:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Bloco de Mídia Esquerdo (Desktop) / Topo (Mobile) */}
            <div className="relative w-full h-[75%] md:w-3/10 md:h-full">
                <div className="absolute inset-0">
                    {slidesData.map((slide, index) => {
                        const isActive = currentSlide === index;
                        const commonClasses = `absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out`;
                        if (slide.type === 'image') {
                            return <img key={index} src={slide.src} alt={slide.alt} className={`${commonClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`} />;
                        }
                        if (slide.type === 'video') {
                            return (
                                <video key={index} ref={el => videoRefs.current[index] = el} className={`${commonClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`} loop muted playsInline>
                                    <source src={slide.src} type="video/mp4" />
                                </video>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent md:hidden"></div>
            </div>

            {/* Bloco de Conteúdo Direito (Desktop) / Baixo (Mobile) */}
            <div className="relative flex-1 flex flex-col justify-center items-center p-4 text-center md:w-1/3 md:h-full md:items-start md:text-left md:p-12">
                
                {/* Bloco de Conteúdo para Desktop (escondido no mobile) */}
                <div className="hidden md:flex flex-col w-full h-full">
                    {/* Bloco de Texto (agora cresce e centraliza o conteúdo) */}
                    <div className="flex-grow flex flex-col justify-center animate-fade-in">
                        <h2 className="text-4xl font-bold mb-3">{slidesData[currentSlide].title}</h2>
                        <p className="text-gray-400 text-base">{slidesData[currentSlide].description}</p>
                    </div>

                    {/* Bloco de Navegação (Botões + Filmstrip) */}
                    <div>
                         {/* Botões de Ação */}
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleNext} 
                                className="bg-[#b554b5] text-black font-bold px-8 py-3 rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:brightness-110 active:scale-100"
                            >
                                {currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}
                            </button>
                            {/* Botão Pular Condicional com Animação */}
                            {currentSlide !== totalSlides - 1 && (
                                <button 
                                    onClick={handleSkip} 
                                    className="text-gray-300 font-semibold px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-100">
                                    Pular
                                </button>
                            )}
                        </div>

                        {/* Filmstrip de Navegação */}
                        <div className="flex flex-col items-start mt-8">
                            <p className="text-sm font-semibold text-gray-500 mb-3">NAVEGAR</p>
                            <div className="flex items-center space-x-3">
                                {slidesData.map((slide, index) => (
                                    <button key={index} onClick={() => handleDotClick(index)} className={`w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${currentSlide === index ? 'ring-2 ring-offset-2 ring-offset-[#0d0d0d] ring-[#b554b5]' : 'opacity-50 hover:opacity-100'}`}>
                                        {slide.type === 'image' && <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />}
                                        {slide.type === 'video' && <video src={slide.src} className="w-full h-full object-cover" muted playsInline />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo e Navegação Mobile (escondido no desktop) */}
                <div className="w-full max-w-md flex flex-col justify-between flex-1 py-4 md:hidden">
                    <div className="w-full mx-auto">
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2">{slidesData[currentSlide].title}</h2>
                            <p className="text-gray-300 text-sm max-w-xs mx-auto">{slidesData[currentSlide].description}</p>
                        </div>
                    </div>
                    <div className="w-full mx-auto flex flex-col items-center">
                        <div className="flex space-x-2 my-5">
                            {slidesData.map((_, index) => (
                                <button key={index} onClick={() => handleDotClick(index)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#b554b5] w-6' : 'bg-gray-400 w-2'}`} />
                            ))}
                        </div>
                        <div className="flex items-center justify-between w-full mt-2">
                            {currentSlide !== totalSlides - 1 && (
                                <button 
                                    onClick={handleSkip} 
                                    className="text-gray-300 font-semibold px-4 py-2 rounded-full transition-transform duration-200 active:scale-95"
                                >
                                    Pular
                                </button>
                            )}
                            <button 
                                onClick={handleNext} 
                                className="bg-[#b554b5] text-black font-bold px-8 py-3 rounded-full ml-auto transition-transform duration-200 hover:scale-105 active:scale-100"
                            >
                                {currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export { IntroScreen };