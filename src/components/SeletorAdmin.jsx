// src/components/SeletorAdmin.jsx
import React from "react";

const SeletorAdmin = ({ selected, setSelected }) => {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex bg-[var(--bg-color2)] rounded-xl p-1 mt-5 gap-1">
          <button
            className={`px-10 py-3  rounded-xl font-medium focus:outline-none transition-colors duration-300 text-white ${
              selected === "jogadora"
                ? "bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]"
                : "bg-[var(--bg-color2)] hover:bg-[var(--bg-color2-hover)]"
            }`}
            type="button"
            onClick={() => setSelected("jogadora")}
          >
            Jogadora
          </button>
          <button
            className={`px-10 py-3 rounded-xl font-medium focus:outline-none transition-colors duration-300 text-white ${
              selected === "organizador"
                ? "bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] "
                : "bg-[var(--bg-color2)] hover:bg-[var(--bg-color2-hover)]"
            }`}
            type="button"
            onClick={() => setSelected("organizador")}
          >
            Organizador
          </button>
        </div>
        <p className="text-gray-400 flex justify-center pt-2 text-sm">
          {selected === "jogadora"
            ? "Jogadora participa de campeonatos e encontra times."
            : "Organizadora cria campeonatos e administra clubes."}
        </p>
      </div>
    </>
  );
};

export default SeletorAdmin;