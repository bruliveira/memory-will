import React from "react";
import "./StartScreen.css";

const StartScreen = ({ onStart, highScores }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <div className="title">
          <h1>🏖️ Jogo da Memória 🏖️</h1>
          <p>Amg, encontre os pares de emojis da praia!</p>
        </div>

        <div className="character-preview">
          <div className="photo-preview">
            <img
              src="/minha-praia.png"
              alt="Minha foto de praia"
              className="beach-photo"
            />
          </div>
        </div>

        <div className="instructions">
          <p>🎯 Clique nas cartas para virá-las</p>
          <p>🔍 Encontre os pares iguais</p>
          <p>🏆 Complete todos os pares para vencer!</p>
        </div>

        {Object.values(highScores).some((score) => score > 0) && (
          <div className="high-scores">
            <h3>🏆 Suas melhores Pontuações amgg:</h3>
            <div className="scores-grid">
              {[2, 4, 6, 8, 10].map((diff) => (
                <div key={diff} className="score-item">
                  <span className="difficulty-label">{diff} pares:</span>
                  <span className="score-value">
                    {highScores[diff] > 0
                      ? `${highScores[diff]} movimentos`
                      : "Nenhum"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="start-button" onClick={onStart}>
          🎮 Começar Jogo - Let's go 🎮
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
