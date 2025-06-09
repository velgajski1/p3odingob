import Phaser from 'phaser';

export default class Odin extends Phaser.Physics.Arcade.Sprite
{
  private startX: number;
  private startY: number;
  private horizontalSpeed: number = 100; // pixels per second
  private isLaunched: boolean = false;
  private isFalling: boolean = false;
  private targetRotation: number = 0;
  private rotationSpeed: number = 0.15; // Smooth rotation speed

  constructor(scene: Phaser.Scene, x: number, y: number)
  {
    super(scene, x, y, 'odin');
    this.startX = x;
    this.startY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
  }

  // Launch Odin with a given velocity
  launch(power: number)
  {
    this.setVelocityY(-power);
    this.isLaunched = true;
    this.isFalling = false; // Reset falling state
  }

  // Set launch state from GameScene
  setLaunchedState(launched: boolean)
  {
    this.isLaunched = launched;
    if (!launched)
    {
      this.isFalling = false; // Reset falling when landing
    }
  }

  // Update horizontal movement toward cursor
  update(delta: number)
  {
    // Detect falling when launched and velocity changes from positive to negative
    if (this.isLaunched && this.body && this.body.velocity.y > 0)
    {
      this.isFalling = true;
    }

    // Move horizontally if we're launched (both rising and falling)
    if (this.isLaunched)
    {
      const pointer = this.scene.input.activePointer;
      if (pointer)
      {
        const targetX = pointer.worldX;
        const currentX = this.x;

        console.log('targetX', targetX, 'currentX', currentX, this.body?.velocity.y);

        // Calculate direction to move
        if (targetX > currentX + 10)
        {
          // Move right
          this.setVelocityX(this.horizontalSpeed);
          // Set target rotation toward cursor (tilt right) or falling rotation
          this.targetRotation = this.isFalling ? Phaser.Math.DegToRad(180) : Phaser.Math.DegToRad(15);
        } else if (targetX < currentX - 10)
        {
          // Move left
          this.setVelocityX(-this.horizontalSpeed);
          // Set target rotation toward cursor (tilt left) or falling rotation
          this.targetRotation = this.isFalling ? Phaser.Math.DegToRad(180) : Phaser.Math.DegToRad(-15);
        } else
        {
          // Stop horizontal movement when close to target
          this.setVelocityX(0);
          // Set target rotation to neutral or falling rotation
          this.targetRotation = this.isFalling ? Phaser.Math.DegToRad(180) : 0;
        }
      }
    } else
    {
      // Not launched - neutral rotation
      this.targetRotation = 0;
    }

    // Apply smooth rotation transition
    const currentRotation = this.rotation;
    const rotationDiff = this.targetRotation - currentRotation;
    this.setRotation(currentRotation + rotationDiff * this.rotationSpeed);
  }

  // Reset Odin to starting position
  reset()
  {
    console.log('resetting');
    this.setPosition(this.startX, this.startY);
    this.setVelocity(0, 0);
    this.setAcceleration(0, 0);
    this.isLaunched = false;
    this.isFalling = false;
    this.targetRotation = 0;
    this.setRotation(0);
  }
}