import React, { useState } from "react";

const SeletorAdmin = () => {
  const [selected, setSelected] = useState("jogadora");
  return (
    <>
    <div className="flex bg-gray-800 rounded-xl w-fit p-1 mt-5 place-self-center gap-1">
      <button
        className={`px-10 py-3  rounded-xl font-medium focus:outline-none transition-colors duration-300 text-white ${
          selected === "jogadora"
            ? "bg-[#b554b5] hover:bg-[#d44b84]"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
        type="button"
        onClick={() => setSelected("jogadora")}
      >
        Jogadora
      </button>
      <button
        className={`px-10 py-3 rounded-xl font-medium focus:outline-none transition-colors duration-300 text-white ${
          selected === "organizador"
            ? "bg-[#b554b5] hover:bg-[#d44b84] "
            : "bg-gray-800 hover:bg-gray-700"
        }`}
        type="button"
        onClick={() => setSelected("organizador")}
      >
        Organizador
      </button>
    </div>
    <p className="text-gray-400 flex justify-center pt-2 text-sm"  >{selected === "jogadora"
        ? "Jogadora participa de campeonatos e encontra times."
        : "Organizadora cria campeonatos, quadras e administra clubes."
        }</p>
    </>
  );
};

export default SeletorAdmin;
