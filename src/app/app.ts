// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   HostListener
// } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   templateUrl: './app.html',
//   styleUrls: ['./app.scss']
// })
// export class app implements AfterViewInit {

//   @ViewChild('gameCanvas')
//   canvas!: ElementRef<HTMLCanvasElement>;

//   ctx!: CanvasRenderingContext2D;

//   grid = 20;
//   canvasSize = 500;

//   snake = [
//     { x: 200, y: 200 }
//   ];

//   direction = 'RIGHT';

//   food = { x: 100, y: 100 };

//   score = 0;

//   gameRunning = false;

//   interval: any;

//   ngAfterViewInit() {
//     this.ctx = this.canvas.nativeElement.getContext('2d')!;
//     this.draw();
//   }

//   startGame() {

//     clearInterval(this.interval);

//     this.snake = [
//       { x: 200, y: 200 }
//     ];

//     this.direction = 'RIGHT';

//     this.score = 0;

//     this.food = this.randomFood();

//     this.gameRunning = true;

//     this.interval = setInterval(() => {
//       this.update();
//     }, 120);

//   }

//   randomFood() {

//     return {
//       x: Math.floor(Math.random() * 25) * this.grid,
//       y: Math.floor(Math.random() * 25) * this.grid
//     };

//   }

//   update() {

//     const head = { ...this.snake[0] };

//     switch (this.direction) {

//       case 'UP':
//         head.y -= this.grid;
//         break;

//       case 'DOWN':
//         head.y += this.grid;
//         break;

//       case 'LEFT':
//         head.x -= this.grid;
//         break;

//       case 'RIGHT':
//         head.x += this.grid;
//         break;

//     }

//     // Wall Collision
//     if (
//       head.x < 0 ||
//       head.y < 0 ||
//       head.x >= this.canvasSize ||
//       head.y >= this.canvasSize
//     ) {
//       this.gameOver();
//       return;
//     }

//     // Self Collision
//     for (let s of this.snake) {

//       if (s.x === head.x && s.y === head.y) {

//         this.gameOver();
//         return;

//       }

//     }

//     this.snake.unshift(head);

//     if (
//       head.x === this.food.x &&
//       head.y === this.food.y
//     ) {

//       this.score++;

//       this.food = this.randomFood();

//     } else {

//       this.snake.pop();

//     }

//     this.draw();

//   }

//   draw() {

//     this.ctx.fillStyle = "#000";
//     this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

//     // Food

//     this.ctx.fillStyle = "red";
//     this.ctx.fillRect(
//       this.food.x,
//       this.food.y,
//       this.grid,
//       this.grid
//     );

//     // Snake

//     for (let i = 0; i < this.snake.length; i++) {

//       this.ctx.fillStyle =
//         i === 0 ? "#00ff00" : "#7CFC00";

//       this.ctx.fillRect(
//         this.snake[i].x,
//         this.snake[i].y,
//         this.grid,
//         this.grid
//       );

//     }

//   }

//   gameOver() {

//     clearInterval(this.interval);

//     this.gameRunning = false;

//     alert("Game Over!\nScore : " + this.score);

//   }

//   @HostListener('window:keydown', ['$event'])

//   keyEvent(event: KeyboardEvent) {

//     switch (event.key) {

//       case 'ArrowUp':
//         if (this.direction !== 'DOWN')
//           this.direction = 'UP';
//         break;

//       case 'ArrowDown':
//         if (this.direction !== 'UP')
//           this.direction = 'DOWN';
//         break;

//       case 'ArrowLeft':
//         if (this.direction !== 'RIGHT')
//           this.direction = 'LEFT';
//         break;

//       case 'ArrowRight':
//         if (this.direction !== 'LEFT')
//           this.direction = 'RIGHT';
//         break;

//     }

//   }

// }
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'

})
export class AppComponent {
  title = '2048 Game';
  board: number[][] = [];
  score = 0;
  size = 4;
  gameOver = false;
  startX = 0;
  startY = 0;

  endX = 0;
  endY = 0;

  minSwipeDistance = 40;
  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.score = 0;
    this.gameOver = false;
    this.board = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    this.addRandom();
    this.addRandom();
  }
  addRandom() {

    let empty = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] == 0) {
          empty.push({ i, j });
        }
      }
    }
    if (empty.length == 0) {
      return;
    }
    const cell = empty[Math.floor(Math.random() * empty.length)];
    this.board[cell.i][cell.j] = Math.random() < 0.9 ? 2 : 4;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (this.gameOver) return;

    switch (event.key) {

      case 'ArrowLeft':
        this.moveLeft();
        break;

      case 'ArrowRight':
        this.moveRight();
        break;

      case 'ArrowUp':
        this.moveUp();
        break;

      case 'ArrowDown':
        this.moveDown();
        break;
    }
  }
  onPointerDown(event: PointerEvent) {
    this.startX = event.clientX;
    this.startY = event.clientY;
  }
  onPointerUp(event: PointerEvent) {

    this.endX = event.clientX;
    this.endY = event.clientY;

    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    if (Math.abs(dx) < this.minSwipeDistance &&
      Math.abs(dy) < this.minSwipeDistance) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
    } else {
      if (dy > 0) {
        this.moveDown();
      } else {
        this.moveUp();
      }
    }
  }
  moveRight() {
    this.rotate180();
    this.moveLeft();
    this.rotate180();
  }

  moveUp() {
    this.rotateLeft();
    this.moveLeft();
    this.rotateRight();
  }

  moveDown() {
    this.rotateRight();
    this.moveLeft();
    this.rotateLeft();
  }
  moveLeft() {
    let changed = false;
    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter(x => x != 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] == row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < this.size) {
        row.push(0);
      }
      if (JSON.stringify(this.board[i]) != JSON.stringify(row)) {
        changed = true;
      }
      this.board[i] = row;
    }
    if (changed) {
      this.addRandom();
      if (this.hasWon()) {
        setTimeout(() => {
          alert("🎉 Congratulations! You reached 2048!");
        }, 100);
      }
      if (!this.canMove()) {
        this.gameOver = true;
        setTimeout(() => {
          alert("💀 Game Over");
        }, 100);
      }
    }
  }

  rotateLeft() {
    this.board = this.board[0].map((_, i) =>
      this.board.map(r => r[this.size - 1 - i])
    );
  }

  rotateRight() {
    this.board = this.board[0].map((_, i) =>
      this.board.map(r => r[i]).reverse()
    );
  }

  rotate180() {
    this.rotateRight();
    this.rotateRight();
  }
  hasWon(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }
  canMove(): boolean {
    // Empty Cell
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    // Horizontal

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    // Vertical
    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size - 1; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }
    return false;
  }
}