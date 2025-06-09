import Phaser from 'phaser';

export default class LauncherBar
{
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private fill: number = 0;
  private filling: boolean = true;
  private speed: number = 1.5; // fill cycles per second
  private stopped: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number)
  {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.graphics = scene.add.graphics();
    this.graphics.setScrollFactor(0, 0); // Fixed to camera
    this.draw();
  }

  update(dt: number)
  {
    if (this.stopped) return;
    const delta = (dt / 1000) * this.speed;
    if (this.filling)
    {
      this.fill += delta;
      if (this.fill >= 1)
      {
        this.fill = 1;
        this.filling = false;
      }
    } else
    {
      this.fill -= delta;
      if (this.fill <= 0)
      {
        this.fill = 0;
        this.filling = true;
      }
    }
    this.draw();
  }

  getPower(): number
  {
    return this.fill;
  }

  stop()
  {
    this.stopped = true;
  }

  reset()
  {
    this.stopped = false;
    this.fill = 0;
    this.filling = true;
    this.draw();
  }

  private draw()
  {
    this.graphics.clear();
    // Bar background
    this.graphics.fillStyle(0x444444, 1);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
    // Bar fill - vertical fill from bottom to top
    this.graphics.fillStyle(0x00ff00, 1);
    const fillHeight = this.height * this.fill;
    const fillY = this.y + this.height - fillHeight; // Start from bottom
    this.graphics.fillRect(this.x, fillY, this.width, fillHeight);
    // Bar border
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.graphics.strokeRect(this.x, this.y, this.width, this.height);
  }
}