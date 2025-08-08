import React, { useState, useEffect, useCallback } from "react";
import "./Game.css";

const Game = ({ onGameOver }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState(4); // Quantidades de pares

  const beachEmojis = [
    "🏖️",
    "🌊",
    "🐚",
    "🦀",
    "🐠",
    "🦈",
    "🏄‍♀️",
    "🏊‍♀️",
    "⛱️",
    "🌴",
    "🍹",
    "🏐",
    "🦑",
    "🐡",
    "🦞",
    "🐙",
  ];

  // Pares de cartas
  const createCards = useCallback(() => {
    const selectedEmojis = beachEmojis.slice(0, difficulty);
    const cards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    return cards;
  }, [difficulty]);

  const [cards, setCards] = useState([]);

  // Recriar cartas quando a dificuldade mudar
  useEffect(() => {
    setCards(createCards());
  }, [createCards]);

  // Resetar jogo
  const resetGame = useCallback(() => {
    const newCards = createCards();
    setCards(newCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
    setGameStarted(false);
  }, [createCards]);

  // Verificar se o jogo foi completado
  useEffect(() => {
    if (matchedPairs.length === difficulty) {
      setGameCompleted(true);
      onGameOver(moves, difficulty);
    }
  }, [matchedPairs.length, difficulty, moves, onGameOver]);

  // Virar carta
  const handleCardClick = useCallback(
    (cardId) => {
      if (!gameStarted) return;

      const card = cards.find((c) => c.id === cardId);
      if (
        !card ||
        card.isFlipped ||
        card.isMatched ||
        selectedCards.length >= 2
      )
        return;

      const newCards = cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );
      setCards(newCards);

      const newSelectedCards = [...selectedCards, cardId];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 2) {
        setMoves((prev) => prev + 1);

        const [firstId, secondId] = newSelectedCards;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        if (firstCard.emoji === secondCard.emoji) {
          // Deu certo
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true, isFlipped: true }
                  : c
              )
            );
            setMatchedPairs((prev) => [...prev, firstCard.emoji]);
            setSelectedCards([]);
          }, 500);
        } else {
          // Não dá certo
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setSelectedCards([]);
          }, 1000);
        }
      }
    },
    [cards, selectedCards, gameStarted]
  );

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    // Resetar o jogo quando mudar a dificuldade
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
    setGameStarted(true); // Começa automaticamente
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score">🎯 Movimentos: {moves}</div>
        <div className="pairs">
          🏆 Pares: {matchedPairs.length}/{difficulty}
        </div>
      </div>

      <div className="game-area">
        {/* Céu */}
        <div className="sky"></div>
        {/* Sol */}
        <div className="sun">☀️</div>
        {/* Nuvens */}
        <div className="clouds">
          <div className="cloud cloud1">☁️</div>
          <div className="cloud cloud2">☁️</div>
          <div className="cloud cloud3">☁️</div>
        </div>
        {/* Mar */}
        <div className="ocean">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
        {/* Areia */}
        <div className="sand"></div>
        {/* Área do jogo de memória */}
        <div className="memory-game-area">
          <div className="cards-grid" data-cards={cards.length}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={`memory-card ${card.isFlipped ? "flipped" : ""} ${
                  card.isMatched ? "matched" : ""
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-front">🏖️</div>
                  <div className="card-back">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!gameStarted && (
        <div className="game-start-overlay">
          <div className="start-message">
            <h2>🏖️ Jogo da Memória 🏖️</h2>
            <p>Amgg encontre os pares de emojis da praia!</p>
            <div className="difficulty-selector">
              <h3>Escolha a dificuldade:</h3>
              <div className="difficulty-buttons">
                {[2, 4, 6, 8, 10].map((diff) => (
                  <button
                    key={diff}
                    className={`difficulty-btn ${
                      difficulty === diff ? "active" : ""
                    }`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {diff} pares
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameCompleted && (
        <div className="game-over-overlay">
          <div className="game-over-message">
            <h2>🎉 Parabéns amgg! 🎉</h2>
            <p>Você completou o jogo em {moves} movimentos!</p>
            <button className="restart-btn" onClick={resetGame}>
              Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Game;
