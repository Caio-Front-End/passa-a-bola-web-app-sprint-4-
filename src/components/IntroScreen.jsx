
import React, { useState, useEffect, useRef } from 'react';
import introVideoHub from '../assets/intro-src/intro-video-hub.mp4';
import introVideoQuadras from '../assets/intro-src/intro-video-quadras.mp4';
import introVideoTonha from '../assets/intro-src/intro-video-tonha.mp4';

const slidesData = [
    {
        type: 'video',
        src: introVideoHub,
        alt: 'Jogadoras em frente a um gol de futebol.',
        title: 'Um Hub só para você!',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        type: 'video',
        src: introVideoQuadras,
        alt: 'Mulher deitada na grama de um campo de futebol, sorrindo.',
        title: 'Encontre quadras!',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        type: 'video',
        src: introVideoTonha,
        title: 'Publique e compartilhe!',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        type: 'image',
        src: 'https://images.pexels.com/photos/9517938/pexels-photo-9517938.jpeg',
        alt: 'Jogadora se preparando para chutar a bola.',
        title: 'Tire suas dúvidas com a Tonha!',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        type: 'image',
        src: 'https://images.pexels.com/photos/9517938/pexels-photo-9517938.jpeg',
        alt: 'Jogadora correndo com a bola no campo.',
        title: 'Voe mais alto!',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
    }
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

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onFinish();
        }
    };

    const handleSkip = () => onFinish();
    const handleDotClick = (index) => setCurrentSlide(index);

    return (
        <div className="h-screen w-screen overflow-hidden bg-black flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Top Container for Media */}
            <div className="relative w-full h-[70%]">
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
                                    className={`${commonClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                />
                            );
                        }
                        if (slide.type === 'video') {
                            return (
                                <video
                                    key={index}
                                    ref={el => videoRefs.current[index] = el}
                                    className={`${commonClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                    loop muted playsInline
                                >
                                    <source src={slide.src} type="video/mp4" />
                                </video>
                            );
                        }
                        return null;
                    })}
                </div>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-black via-gray-black/70 to-transparent"></div>
            </div>

            {/* Bottom Container for Content */}
            <div className="relative flex-1 flex flex-col justify-center items-center p-4 text-white text-center">
                <div className="w-full max-w-md flex flex-col justify-between flex-1 py-4">
                    {/* Text Content */}
                    <div className="w-full mx-auto">
                        <div key={currentSlide} className="animate-fade-in">
                            <h2 className="text-2xl lg:text-4xl font-bold mb-2">{slidesData[currentSlide].title}</h2>
                            <p className="text-gray-300 text-sm max-w-xs mx-auto">
                                {slidesData[currentSlide].description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="w-full mx-auto flex flex-col items-center">
                        <div className="flex space-x-2 my-5">
                            {slidesData.map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ease-out ${currentSlide === index ? 'bg-[#b554b5] w-6' : 'bg-gray-400 w-2'}`}
                                />
                            ))}
                        </div>
                        
                        <div className="flex items-center justify-between w-full mt-2">
                            <button onClick={handleSkip} className="text-gray-300 font-semibold px-4 py-2">Pular</button>
                            <button onClick={handleNext} className="bg-[#b554b5] text-black font-bold px-8 py-3 rounded-full">
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