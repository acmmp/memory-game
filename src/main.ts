import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="loading-screen" *ngIf="isLoading">
      <div class="loader"></div>
      <p class="loading-text">Cargando...</p>
      <p class="creator-text">Este juego se ha creado con Angular por Adrian Campayo</p>
    </div>
    <div class="game-container" [class.hidden]="isLoading">
      <div class="game-board">
        <h1>🧠 Juego de Memoria 🧠</h1>
        <div class="controls">
          <div class="control-item">
            <label for="difficulty">Dificultad: </label>
            <select id="difficulty" [(ngModel)]="difficulty" (change)="resetGame()">
              <option value="3">Muy Fácil (3x3)</option>
              <option value="4">Fácil (4x4)</option>
              <option value="6">Medio (6x6)</option>
              <option value="8">Difícil (8x8)</option>
            </select>
          </div>
          <div class="control-item">
            <button (click)="resetGame()">🔄 Reiniciar Juego</button>
          </div>
        </div>
        <div class="info">
          <p>⏱️ Tiempo: {{ timer }} segundos</p>
          <p>🔢 Movimientos: {{ moves }}</p>
        </div>
        <div class="board" [style.grid-template-columns]="'repeat(' + difficulty + ', 1fr)'">
          <div *ngFor="let card of cards" 
               class="card" 
               [class.flipped]="card.flipped || card.matched"
               (click)="flipCard(card)">
            <div class="card-inner">
              <div class="card-front"></div>
              <div class="card-back">{{ card.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
 .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #3498db, #8e44ad);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .loader-container {
      position: relative;
      width: 100px;
      height: 100px;
    }
    .loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 8px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 8px solid #ffffff;
      animation: spin 1s linear infinite;
    }
    .loader-inner {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 70%;
      height: 70%;
      border: 8px solid transparent;
      border-radius: 50%;
      border-top: 8px solid #ffffff;
      animation: spin 0.8s linear infinite reverse;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading-text {
      color: white;
      font-size: 2em;
      margin-top: 20px;
      font-weight: bold;
    }
    .dot-animation {
      animation: dotAnimation 1.5s infinite;
    }
    @keyframes dotAnimation {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    .creator-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2em;
      margin-top: 20px;
      text-align: center;
      max-width: 80%;
    }
    .hidden {
      display: none;
    }
    .game-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100vh;
      background-image: url('https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg');
      background-size: cover;
      background-position: center;
      overflow: auto;
    }
    .game-board {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      max-height: 90vh;
      width: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
    }
    h1 {
      color: #2c3e50;
      font-size: 2em;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;
      width: 100%;
    }
    .control-item {
      display: flex;
      align-items: center;
    }
    .control-item label {
      margin-right: 10px;
    }
    .board {
      display: grid;
      gap: 10px;
      margin-top: 15px;
      justify-content: center;
      width: 100%;
      max-width: 80vmin;
      max-height: 80vmin;
    }
    .card {
      aspect-ratio: 1;
      perspective: 1000px;
      cursor: pointer;
    }
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .card.flipped .card-inner {
      transform: rotateY(180deg);
    }
    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2em;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .card-front {
      background-color: #3498db;
      background-image: linear-gradient(45deg, #3498db, #2980b9);
    }
    .card-back {
      background-color: #2ecc71;
      background-image: linear-gradient(45deg, #2ecc71, #27ae60);
      transform: rotateY(180deg);
    }
    .info {
      display: flex;
      justify-content: space-around;
      margin-bottom: 15px;
      font-size: 1em;
      width: 100%;
    }
    .info p {
      font-weight: bold;
      color: #34495e;
      margin: 5px;
    }
    button, select {
      margin: 5px;
      padding: 8px 15px;
      font-size: 0.9em;
      border: none;
      border-radius: 5px;
      background-color: #3498db;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.1s;
    }
    button:hover, select:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
    }
    button:active, select:active {
      transform: translateY(0);
    }
    @media (max-width: 600px) {
      .game-board {
        padding: 15px;
      }
      h1 {
        font-size: 1.5em;
      }
      .controls {
        flex-direction: column;
      }
      .info {
        flex-direction: column;
        align-items: center;
      }
      .info p {
        margin: 3px 0;
      }
      .card-front, .card-back {
        font-size: 1.5em;
      }
    }
  `]
})
export class App {
  difficulty: number = 4;
  cards: Card[] = [];
  flippedCards: Card[] = [];
  moves: number = 0;
  timer: number = 0;
  gameInterval: any;
  isLoading: boolean = true;

  emojis: string[] = ['😀', '😎', '🥳', '🤩', '🤯', '🥶', '🤠', '👽', '🤖', '👻', '🦄', '🐶', '🐱', '🐼', '🐨', '🦁', '🐯', '🦊', '🦋', '🐙', '🦜', '🦚', '🌈', '🍕', '🍔', '🍦', '🍭', '🎸', '🚀', '🌟', '🏆', '💎'];

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      this.resetGame();
    }, 3000); // Muestra la pantalla de carga durante 3 segundos
  }

  resetGame() {
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.timer = 0;
    clearInterval(this.gameInterval);

    const pairs = Math.floor((this.difficulty * this.difficulty) / 2);
    const shuffledEmojis = this.shuffleArray(this.emojis).slice(0, pairs);
    const allCards = [...shuffledEmojis, ...shuffledEmojis];
    const shuffledCards = this.shuffleArray(allCards);

    for (let i = 0; i < this.difficulty * this.difficulty; i++) {
      this.cards.push({id: i, value: shuffledCards[i], flipped: false, matched: false});
    }

    this.startTimer();
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startTimer() {
    this.gameInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      setTimeout(() => this.checkMatch(), 500);
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.value === card2.value) {
      card1.matched = card2.matched = true;
      this.flippedCards = [];
      if (this.cards.every(card => card.matched)) {
        clearInterval(this.gameInterval);
        setTimeout(() => {
          alert(`🎉 ¡Felicidades! 🎉\nHas completado el juego en ${this.timer} segundos y ${this.moves} movimientos.`);
        }, 300);
      }
    } else {
      setTimeout(() => {
        card1.flipped = card2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }
}

bootstrapApplication(App);