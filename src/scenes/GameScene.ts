import Phaser from 'phaser';
import Odin from '../objects/Odin';
import LauncherBar from '../objects/LauncherBar';
import Gob from '../objects/Gob';

export default class GameScene extends Phaser.Scene
{
  private odin!: Odin;
  private launcherBar!: LauncherBar;
  private launched: boolean = false;
  private gobs!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private scoreGob!: Phaser.GameObjects.Container;
  private groundSprite!: Phaser.GameObjects.Sprite;
  private canLaunch: boolean = true;
  private overlapHandler: Phaser.Physics.Arcade.Collider | null = null;
  private launchTime: number = 0;
  private launchDelay: number = 1000; // 1 second delay before allowing landing detection

  constructor()
  {
    super({ key: 'GameScene' });
  }

  preload()
  {
    this.load.image('odin', 'assets/odin.png');
    this.load.image('cloud', 'assets/cloud.png');
    this.load.image('mountain', 'assets/mountain.png');
  }

  create()
  {
    // Set up 3-screen-tall world
    this.physics.world.setBounds(0, 0, 480, 2400); // 3x camera height

    // Set initial camera position to show the bottom of the world
    this.cameras.main.setScroll(0, 1600); // Show bottom portion of world

    // Set camera world bounds to prevent going below the ground level
    this.cameras.main.setBounds(0, 0, 480, 2400);

    this.drawSkyGradient();
    this.drawMountains();
    this.drawGround();

    this.drawDarkClouds();

    // Place Odin at the bottom center of the world
    const startX = this.cameras.main.width / 2;
    const startY = 2400 - 80; // Bottom of world minus some offset
    this.odin = new Odin(this, startX, startY);
    this.odin.setScale(1);

    // Add collision between Odin and ground
    this.physics.add.collider(this.odin, this.groundSprite);

    // Launcher bar on the right side
    const barWidth = 24;
    const barHeight = 300;
    const barX = this.cameras.main.width - 40; // 40px from right edge
    const barY = (this.cameras.main.height - barHeight) / 2; // Center vertically
    this.launcherBar = new LauncherBar(this, barX, barY, barWidth, barHeight);

    // Score display - gob sprite with number
    const scoreGobGraphics = this.add.graphics();
    const gobColor = Gob.randomColor();
    this.drawGobForScore(scoreGobGraphics, gobColor);
    this.scoreGob = this.add.container(30, 36);
    this.scoreGob.add(scoreGobGraphics);
    this.scoreGob.setScale(0.8);
    this.scoreGob.setScrollFactor(0, 0); // Fixed to camera

    this.scoreText = this.add.text(60, 30, '0', {
      font: '24px Arial',
      color: '#fff',
      stroke: '#222',
      strokeThickness: 4
    });
    this.scoreText.setScrollFactor(0, 0); // Fixed to camera

    // Gobs group
    this.gobs = this.physics.add.group();

    // Spawn gobs immediately in the air
    this.spawnGobs();

    // Input: spacebar or pointer
    this.input.keyboard!.on('keydown-SPACE', this.tryLaunch, this);
    this.input.on('pointerdown', this.tryLaunch, this);
  }

  private drawSkyGradient()
  {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const graphics = this.add.graphics();
    const steps = 32;
    const colorStart = Phaser.Display.Color.ValueToColor(0xffffff); // white
    const colorEnd = Phaser.Display.Color.ValueToColor(0x87ceeb); // sky blue
    for (let i = 0; i < steps; i++)
    {
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        colorStart,
        colorEnd,
        steps - 1,
        i
      );
      const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      graphics.fillStyle(hex, 1);
      graphics.fillRect(0, (height / steps) * i, width, height / steps);
    }
    graphics.setDepth(-10);
  }

  private drawGround()
  {
    const width = this.cameras.main.width;
    const worldHeight = 2400; // Full world height
    const groundHeight = 90;
    const groundY = worldHeight - groundHeight; // Ground at bottom of world

    // Visual ground
    const graphics = this.add.graphics();
    graphics.fillStyle(0x3cb043, 1); // green
    graphics.fillRect(0, groundY, width, groundHeight);
    graphics.setDepth(-5);

    // Create an invisible sprite for physics collision
    const groundSprite = this.add.sprite(width / 2, groundY + groundHeight / 2, '');
    groundSprite.setDisplaySize(width, groundHeight);
    groundSprite.setVisible(false); // Make it invisible
    this.physics.add.existing(groundSprite, true); // true = static body

    // Store the ground sprite for later collision setup
    this.groundSprite = groundSprite;
  }

  private drawMountains()
  {
    const width = this.cameras.main.width;
    const worldHeight = 2400; // Full world height
    const groundHeight = 90;
    const groundY = worldHeight - groundHeight; // Ground at bottom of world

    // Add mountains just above the grass, overlapping slightly
    const mountainY = groundY - 40; // 20px above ground for overlap

    // Create multiple mountains across the width
    for (let i = 0; i < 3; i++)
    {
      const x = (width / 4) * (i + 1); // Distribute across screen
      const mountain = this.add.sprite(x, mountainY, 'mountain');

      // Randomize mountain properties
      const scale = Phaser.Math.FloatBetween(0.2, 0.25);
      mountain.setScale(scale);

      // Set depth to be behind grass but above sky
      mountain.setDepth(-6);
    }
  }

  private drawDarkClouds()
  {
    const width = this.cameras.main.width;

    // Create clouds in the upper portion of the world (top 800 pixels)
    for (let i = 0; i < 8; i++)
    {
      const x = Phaser.Math.Between(0, width - 100);
      const y = Phaser.Math.Between(0, 800);

      // Create cloud sprite
      const cloud = this.add.sprite(x, y, 'cloud');

      // Randomize cloud properties
      const scale = Phaser.Math.FloatBetween(0.8, 1.5);
      cloud.setScale(scale);

      // Add movement properties to cloud
      const speed = Phaser.Math.FloatBetween(10, 25); // Slower than gobs (150)
      const direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1; // Random direction
      cloud.setData('speed', speed * direction);

      // Set depth to be behind sky gradient but above ground
      cloud.setDepth(-8);
    }
  }

  update(time: number, delta: number)
  {
    this.launcherBar.update(delta);

    // Update Odin's horizontal movement
    this.odin.update(delta);

    // Update gob movement
    this.gobs.getChildren().forEach((gob: any) =>
    {
      if (gob.update)
      {
        gob.update(delta);
      }
    });

    // Update cloud movement
    this.children.list.forEach((child: any) =>
    {
      if (child.texture && child.texture.key === 'cloud')
      {
        const speed = child.getData('speed');
        if (speed)
        {
          child.x += (speed * delta) / 1000;

          // Wrap clouds around the screen
          if (speed > 0 && child.x > this.cameras.main.width + 100)
          {
            child.x = -100;
          } else if (speed < 0 && child.x < -100)
          {
            child.x = this.cameras.main.width + 100;
          }
        }
      }
    });

    // Simple camera following - center on Odin with world bounds
    const targetY = this.odin.y - this.cameras.main.height / 2;
    this.cameras.main.setScroll(0, targetY);

    // Check if Odin has landed (on the ground) after being launched
    // Only check if enough time has passed since launch to prevent early collision
    if (this.launched &&
      (this.odin.body as Phaser.Physics.Arcade.Body).blocked.down &&
      time - this.launchTime > this.launchDelay)
    {
      console.log('landing detected after', time - this.launchTime, 'ms');
      this.launched = false;
      this.odin.setLaunchedState(false); // Reset Odin's launch state
      this.canLaunch = false; // Prevent immediate re-launch
      this.launcherBar.reset();
      this.odin.reset();

      // Remove the overlap handler to prevent multiple collisions
      if (this.overlapHandler)
      {
        this.overlapHandler.destroy();
        this.overlapHandler = null;
      }

      this.clearGobs();
      // Respawn gobs after clearing them
      this.spawnGobs();

      // Add a small delay before allowing next launch
      this.time.delayedCall(500, () =>
      {
        this.canLaunch = true;
      });
    }
  }

  private tryLaunch()
  {
    if (!this.launched && this.canLaunch && (this.odin.body as Phaser.Physics.Arcade.Body).blocked.down)
    {
      const power = Phaser.Math.Linear(400, 1200, this.launcherBar.getPower());
      console.log('launching', power);
      this.odin.launch(power * 2);
      this.launcherBar.stop();
      this.launched = true;
      this.odin.setLaunchedState(true); // Sync launch state with Odin
      this.launchTime = this.time.now; // Use scene time instead of parameter

      // Create overlap handler and store reference
      this.overlapHandler = this.physics.add.overlap(
        this.odin,
        this.gobs,
        this.collectGob as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
    }
  }

  private spawnGobs()
  {
    this.clearGobs();
    const width = this.cameras.main.width;
    const worldHeight = 2400; // Full world height

    for (let i = 0; i < 15; i++) // Increased number of gobs for larger world
    {
      const x = Phaser.Math.Between(40, width - 40);
      const y = Phaser.Math.Between(120, worldHeight - 200); // Spawn across full world height
      const color = Gob.randomColor();
      const gob = new Gob(this, x, y, color);
      this.gobs.add(gob);
      // Add physics body for overlap
      this.physics.add.existing(gob);
      (gob.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      (gob.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }
  }

  private clearGobs()
  {
    this.gobs.clear(true, true);
  }

  private collectGob(
    odin: Phaser.GameObjects.GameObject,
    gob: Phaser.GameObjects.GameObject
  ): void
  {
    gob.destroy();
    this.score++;
    this.scoreText.setText(this.score.toString());

    // Change the score gob to a random color
    const randomColor = Gob.randomColor();
    this.drawGobForScore(this.scoreGob.list[0] as Phaser.GameObjects.Graphics, randomColor);
  }

  private drawGobForScore(graphics: Phaser.GameObjects.Graphics, color: number)
  {
    graphics.clear();
    const size = 24;
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
}