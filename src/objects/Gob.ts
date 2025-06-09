import Phaser from 'phaser';

const GOB_COLORS = [
  0xff4444, // red
  0x44ff44, // green
  0xffff44, // yellow
  0x4488ff, // blue
  0xaa44ff, // purple
  0xff9900  // orange
];

export default class Gob extends Phaser.GameObjects.Container
{
  static SIZE = 32;
  private speed: number = 150; // pixels per second

  constructor(scene: Phaser.Scene, x: number, y: number, color: number)
  {
    super(scene, x, y);
    const graphics = scene.add.graphics();
    this.drawGob(graphics, color);
    this.add(graphics);
    scene.add.existing(this);
  }

  private drawGob(graphics: Phaser.GameObjects.Graphics, color: number)
  {
    const size = Gob.SIZE;
    const lineH = size / 4;
    // 1st line (main color)
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, size, lineH);
    // 2nd line (eyes)
    graphics.fillStyle(0xffffff, 1); // left white
    graphics.fillRect(0, lineH, size / 4, lineH);
    graphics.fillStyle(0x000000, 1); // left black
    graphics.fillRect(size / 4, lineH, size / 4, lineH);
    graphics.fillStyle(0xffffff, 1); // right white
    graphics.fillRect(size / 2, lineH, size / 4, lineH);
    graphics.fillStyle(0x000000, 1); // right black
    graphics.fillRect(3 * size / 4, lineH, size / 4, lineH);
    // 3rd line (darker main color)
    const darkColor = Phaser.Display.Color.IntegerToColor(color).darken(30).color;
    graphics.fillStyle(darkColor, 1);
    graphics.fillRect(0, 2 * lineH, size, lineH);
    // 4th line (main color)
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 3 * lineH, size, lineH);
  }

  static randomColor(): number
  {
    return GOB_COLORS[Math.floor(Math.random() * GOB_COLORS.length)];
  }

  update(delta: number)
  {
    // Move right
    this.x += (this.speed * delta) / 1000;

    // Wrap around to left side when going offscreen right
    if (this.x > this.scene.cameras.main.width + Gob.SIZE)
    {
      this.x = -Gob.SIZE;
    }
  }
}