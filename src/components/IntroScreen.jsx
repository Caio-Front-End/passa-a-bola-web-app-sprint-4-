import React, { useState, useEffect, useRef } from 'react';
import introVideoHub from '../assets/intro-src/intro-video-hub.mp4';
import introVideoQuadras from '../assets/intro-src/intro-video-quadras.mp4';
import introVideoTonha from '../assets/intro-src/intro-video-tonha.mp4';
import introFotoFinta from '../assets/intro-src/intro-foto-finta.jpg';
import introFotoFinal from '../assets/intro-src/intro-foto-final.jpg';

const slidesData = [
  {
    type: 'video',
    src: introVideoHub,
    alt: 'Jogadoras em frente a um gol de futebol.',
    title: 'Um Hub só para você!',
    description:
      'Dashboard Pessoal com registro de partidas, acompanhamento detalhado de estatísticas e um Gráfico Radar de habilidades para visualização da evolução.',
  },
  {
    type: 'video',
    src: introVideoQuadras,
    alt: 'Mulher deitada na grama de um campo de futebol.',
    title: 'Central de Campeonatos!',
    description:
      'Crie, Encontre e Gerencie campeonatos de Futsal, Society e Campo, centralizando inscrições e informações para as jogadoras.',
  },
  {
    type: 'video',
    src: introVideoTonha,
    title: 'Tire suas ideias com a TONHA!',
    description:
      'Um chatbot, alimentado por IA (Gemini 2.5 Flash), que fornece respostas rápidas e objetivas com foco exclusivo no universo da mulher no futebol.',
  },
  {
    type: 'image',
    src: introFotoFinta,
    alt: 'Jogadora se preparando para chutar.',
    title: 'Publique e Interaja através do FINTA!',
    description:
      'Um feed vertical de vídeos curtos 100% dedicado à comunidade da bola, onde jogadoras compartilham, inspiram e interagem em um ambiente seguro.',
  },
  {
    type: 'image',
    src: introFotoFinal,
    alt: 'Jogadora correndo com a bola.',
    title: 'Voe mais alto!',
    description:
      'Este é o seu ponto de encontro. A comunidade que faltava para o futebol feminino agora está na palma da sua mão. Encontre seu time, eleve seu jogo.',
  },
];

const IntroScreen = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const totalSlides = slidesData.length;

  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (videoEl) {
        if (index === currentSlide && slidesData[index].type === 'video') {
          videoEl
            .play()
            .catch((error) => console.log('Video play was prevented:', error));
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      }
    });
  }, [currentSlide]);

  const handleFinish = () => {
    localStorage.setItem('introSeen', 'true');
    onFinish();
  };

  const handleNext = () =>
    currentSlide < totalSlides - 1
      ? setCurrentSlide(currentSlide + 1)
      : handleFinish();
  const handleSkip = () => handleFinish();
  const handleDotClick = (index) => setCurrentSlide(index);

  return (
    <div
      className="h-dvh w-screen overflow-hidden bg-[var(--bg-color)] flex flex-col text-white md:flex-row"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Container da Mídia (Vídeo/Imagem) */}
      <div className="relative w-full h-[60%] md:w-2/3 md:h-full flex-shrink-0">
        {' '}
        {/* ALTERADO: h-[60%] e flex-shrink-0 */}
        <div className="absolute inset-0">
          {slidesData.map((slide, index) => {
            const isActive = currentSlide === index;
            const commonClasses = `absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out`;
            if (slide.type === 'image') {
              return (
                <img
                  key={index}
                  src={slide.src}
                  alt={slide.alt}
                  className={`${commonClasses} ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              );
            }
            if (slide.type === 'video') {
              return (
                <video
                  key={index}
                  ref={(el) => (videoRefs.current[index] = el)}
                  className={`${commonClasses} ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  loop
                  muted
                  playsInline
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              );
            }
            return null;
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/80 to-transparent md:hidden"></div>
      </div>

      {/* Container do Conteúdo (Texto e Botões) */}
      <div className="relative w-full flex-1 flex flex-col justify-center items-center text-center md:w-1/3 md:items-start md:text-left md:p-12 overflow-hidden">
        {/* Layout de Desktop */}
        <div className="hidden md:flex flex-col w-full h-full">
          <div className="flex-grow flex flex-col justify-center animate-fade-in">
            <h2 className="text-4xl font-bold mb-3">
              {slidesData[currentSlide].title}
            </h2>
            <p className="text-gray-400 text-base">
              {slidesData[currentSlide].description}
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNext}
                className="bg-[var(--primary-color)] text-black font-bold px-8 py-3 rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:brightness-110 active:scale-100"
              >
                {currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}
              </button>
              {currentSlide !== totalSlides - 1 && (
                <button
                  onClick={handleSkip}
                  className="text-gray-300 font-semibold px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-100"
                >
                  Pular
                </button>
              )}
            </div>
            <div className="flex flex-col items-start mt-8">
              <p className="text-sm font-semibold text-gray-500 mb-3">
                NAVEGAR
              </p>
              <div className="flex items-center space-x-3">
                {slidesData.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      currentSlide === index
                        ? 'ring-2 ring-offset-2 ring-offset-[#0d0d0d] ring-[var(--primary-color)]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {slide.type === 'image' && (
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {slide.type === 'video' && (
                      <video
                        src={slide.src}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full max-w-md flex flex-col md:hidden">
          {/* Área de Texto (Rolável) */}
          <div className="flex-1 overflow-y-auto pt-6 pb-2 px-4">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">
                {slidesData[currentSlide].title}
              </h2>
              <p className="text-gray-300 text-sm max-w-xs mx-auto">
                {slidesData[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Área de Controles (Fixa em baixo) */}
          <div className="flex-shrink-0 w-full pb-4 px-4">
            {/* Pontos de Navegação */}
            <div className="flex justify-center space-x-2 my-4">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-[var(--primary-color)] w-6'
                      : 'bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-between w-full min-h-[50px]">
              <div className="w-1/3">
                {currentSlide !== totalSlides - 1 && (
                  <button
                    onClick={handleSkip}
                    className="text-gray-300 font-semibold px-4 py-2 rounded-full transition-transform duration-200 active:scale-95"
                  >
                    Pular
                  </button>
                )}
              </div>
              <div className="w-1/3 flex justify-center">
                {/* Espaço central se necessário */}
              </div>
              <div className="w-1/3 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-[var(--primary-color)] text-black font-bold px-8 py-3 rounded-full transition-transform duration-200 hover:scale-105 active:scale-100"
                >
                  {currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { IntroScreen };
