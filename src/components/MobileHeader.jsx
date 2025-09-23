import logoPabOriginal from '../assets/img/logo-pab-original.png';

const MobileHeader = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between pt-2 pb-2 pl-3 pr-3 bg-[var(--bg-color)] border-b border-[var(--bg-color2)] md:hidden">
            {/* Logo e Nome */}
            <div className="flex items-center gap-2">
                <img
                    src={logoPabOriginal}
                    alt="Logo P.A.B"
                    className="w-8 h-8 brightness-0 invert"
                />
                <h1 className="text-xl font-bold text-white">
                    Passa a Bola
                </h1>
            </div>
        </header>
    );
};

export default MobileHeader;