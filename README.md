# Vertical Pong Game

A modern take on the classic Pong game, implemented in vanilla JavaScript with a vertical gameplay orientation. The game features a player-controlled paddle at the bottom and a computer-controlled opponent at the top.

## Features

- Vanilla JavaScript implementation (no frameworks)
- Vertical gameplay orientation
- Smooth paddle controls
- Computer AI opponent
- Score tracking
- Consistent ball physics
- Responsive canvas-based rendering
- Clean and minimalist design

## How to Play

1. Open `index.html` in a web browser
2. Use the following controls:
   - `A` key: Move paddle left
   - `D` key: Move paddle right
3. Try to get the ball past the computer's paddle while defending your own side
4. Score points when the ball passes the opponent's paddle
5. The game continues indefinitely - try to achieve the highest score!

## Game Mechanics

- The ball's direction changes based on where it hits the paddle
  - Hitting the center of the paddle sends the ball straight
  - Hitting the edges adds horizontal movement
- The ball maintains a consistent speed throughout the game
- The computer AI tracks the ball's movement to provide a challenge

## Technical Details

- Built with:
  - HTML5 Canvas
  - CSS3
  - Vanilla JavaScript
- No external dependencies required
- Responsive design that works in modern browsers

## Project Structure

```
pong/
├── index.html     # Main game HTML
├── styles.css     # Game styling
└── game.js        # Game logic and mechanics
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/husnimarwan/pong.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pong
   ```
3. Open `index.html` in your preferred web browser

## Browser Compatibility

The game works best in modern browsers that support HTML5 Canvas:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

This project is open source and available under the MIT License.