// If you see a "Could not resolve 'react-native'" error,
// it means your project dependencies need to be refreshed.
// Please stop the server and run the following commands in your terminal:
// 1. rm -rf node_modules
// 2. npm install
// 3. npx expo run:android
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ImageBackground, Image } from 'react-native';

// --- ASSETS ---
// Load images from the local assets/images folder
const woodBackgroundImage = require('../../assets/images/background.jpg');
const toothpickImage = require('../../assets/images/toothpick.png');

// --- Type Definitions for TypeScript ---
type Board = (0 | 1 | 2)[];

// --- Constants ---
const INITIAL_BOARD: Board = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// --- Main App Component ---
export default function App() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [history, setHistory] = useState<Board[]>([]);
  const [winMessage, setWinMessage] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const pairs = board.filter(item => item === 2).length;
  const win = pairs === 5;

  // --- Game Logic ---
  const handleSlotPress = (index: number) => {
    if (win) return;

    if (selectedIndex === null) {
      if (board[index] === 1) {
        setSelectedIndex(index);
      }
    } else {
      if (isMoveValid(selectedIndex, index)) {
        handleValidMove(selectedIndex, index);
      }
      setSelectedIndex(null);
    }
  };

  const isMoveValid = (startPos: number, endPos: number): boolean => {
    if (startPos === endPos) return false;
    if (board[startPos] !== 1 || board[endPos] !== 1) return false;

    const step = (endPos > startPos) ? 1 : -1;
    let jumpValue = 0;
    for (let i = startPos + step; i !== endPos; i += step) {
      if (board[i] > 0) jumpValue += board[i];
    }
    return jumpValue === 2;
  };

  const handleValidMove = (startPos: number, endPos: number) => {
      setHistory([...history, board]);

      const newBoard: Board = [...board];
      newBoard[startPos] = 0;
      newBoard[endPos] = 2;
      setBoard(newBoard);

      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);

      if (newBoard.filter(item => item === 2).length === 5) {
        setWinMessage(`You won in ${newMoveCount} moves!`);
      }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setBoard(lastState);
      setHistory(history.slice(0, -1));
      setMoveCount(moveCount - 1);
      setWinMessage('');
      setSelectedIndex(null);
    }
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARD);
    setMoveCount(0);
    setHistory([]);
    setWinMessage('');
    setSelectedIndex(null);
  };

  // --- Render ---
  return (
    <ImageBackground source={woodBackgroundImage} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.headerContainer}>
            <Text style={styles.title}>Grandfather's Game</Text>
            <Text style={styles.subtitle}>Move the toothpicks to form 5 pairs.</Text>
        </View>

        <View style={styles.gameContainer}>
            <View style={styles.gameBoard}>
                {board.map((item, index) => (
                <TouchableOpacity key={index} style={styles.slot} onPress={() => handleSlotPress(index)}>
                    {item === 1 && (
                    <Image source={toothpickImage} style={[styles.toothpickImage, selectedIndex === index && styles.selectedToothpick]} />
                    )}
                    {item === 2 && (
                    <View style={styles.pairContainer}>
                        <Image source={toothpickImage} style={[styles.toothpickImage, styles.pairedToothpick1]} />
                        <Image source={toothpickImage} style={[styles.toothpickImage, styles.pairedToothpick2]} />
                    </View>
                    )}
                </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.footerContainer}>
            {win ? (
                <View style={styles.winContainer}>
                    <Text style={styles.winText}>You Win!</Text>
                </View>
            ) : (
                <Text style={styles.moveCounter}>Moves: {moveCount}</Text>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleUndo} style={styles.button} disabled={history.length === 0}>
                <Text style={[styles.buttonSymbol, history.length === 0 && styles.disabledSymbol]}>⟲</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.button}>
                <Text style={styles.buttonSymbol}>⟳</Text>
                </TouchableOpacity>
            </View>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

// --- Styles (Adjusted for Centered Layout & Buttons) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    width: '100%',
  },
  gameContainer: {
    height: '70%',
    width: '75%',
    justifyContent: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#F5DEB3',
    fontFamily: 'serif',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2B48C',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  moveCounter: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  gameBoard: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  slot: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toothpickImage: {
    width: 90,
    height: '180%',
    resizeMode: 'contain',
  },
  selectedToothpick: {
    tintColor: '#90EE90',
  },
  pairContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairedToothpick1: {
    position: 'absolute',
    transform: [{ rotate: '20deg' }],
  },
  pairedToothpick2: {
    position: 'absolute',
    transform: [{ rotate: '-20deg' }],
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 20,
  },
  disabledSymbol: {
    opacity: 0.4,
  },
  buttonSymbol: {
    color: 'white',
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  winContainer: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
  winText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
