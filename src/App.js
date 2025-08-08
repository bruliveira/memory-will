import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Game from "./components/Game";
import StartScreen from "./components/StartScreen";
import GameOverScreen from "./components/GameOverScreen";

function App() {
  const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(4);
  const [highScores, setHighScores] = useState({
    2: 0,
    4: 0,
    6: 0,
    8: 0,
    10: 0,
  });

  const startGame = () => {
    setGameState("playing");
    setScore(0);
  };

  const endGame = (finalScore, difficulty) => {
    setScore(finalScore);
    setCurrentDifficulty(difficulty);

    // Para jogo de memória, menor pontuação é melhor
    if (highScores[difficulty] === 0 || finalScore < highScores[difficulty]) {
      const newHighScores = { ...highScores, [difficulty]: finalScore };
      setHighScores(newHighScores);
      localStorage.setItem(
        "memoryGameHighScores",
        JSON.stringify(newHighScores)
      );
    }
    setGameState("gameOver");
  };

  const restartGame = () => {
    setGameState("playing");
    setScore(0);
  };

  useEffect(() => {
    const savedHighScores = localStorage.getItem("memoryGameHighScores");
    if (savedHighScores) {
      setHighScores(JSON.parse(savedHighScores));
    }
  }, []);

  return (
    <div className="App">
      {gameState === "start" && (
        <StartScreen onStart={startGame} highScores={highScores} />
      )}
      {gameState === "playing" && <Game onGameOver={endGame} />}
      {gameState === "gameOver" && (
        <GameOverScreen
          score={score}
          difficulty={currentDifficulty}
          highScores={highScores}
          onRestart={restartGame}
          onBackToMenu={() => setGameState("start")}
        />
      )}
    </div>
  );
}

export default App;
