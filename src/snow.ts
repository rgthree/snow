/**
 * @license @preserve
 *
 * MIT License
 *
 * Copyright (c) 2023 Regis Gaughan, III (rgthree)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function r(min: number, max: number, multiplier = 1) {
  min = min * multiplier;
  max = max * multiplier;
  return (Math.floor(Math.random() * (max - min + 1)) + min) / multiplier;
}

type Flake = {
  x: number;
  y: number;
  radius: number;
  density: number;
}

/**
 * A simple snow component to display snowfall on a webpage using HTML5 Canvas.
 *
 * Usage:
 *   <rgthree-snow></rgthree-snow>
 *
 *   Configure number of flakes:
 *   `<rgthree-snow flakes="800"></rgthree-snow>`
 */
class SnowCanvas extends HTMLElement {
  static observedAttributes = ["flakes"];

  private connected = false;

  private canvas: HTMLCanvasElement|null = null;
  private ctx: CanvasRenderingContext2D|null = null;

  private numOfFlakes = 500;
  private radiusMax = 3;
  private currentAngle = 1;

  private flakes: Flake[] = [];

  constructor() {
    super();
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');

    const style = document.createElement("style");
    style.textContent = '\
      canvas { \
        position: fixed; \
        top: 0; \
        left: 0; \
        width: 100%; \
        height: 100%; \
        z-index: 99999; \
        pointer-events: none; \
      }';

    shadow.appendChild(style);
    shadow.appendChild(this.canvas);
    this.connected = true;
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  disconnectedCallback() {
    this.connected = false;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'flakes') {
      this.numOfFlakes = Number(newValue) || 500;
    }
  }

  private generateFlakes() {
    if (!this.ctx || !this.canvas || !this.connected) {
      return;
    }
    this.flakes = [];
    for (let i = 0; i < this.numOfFlakes; i++) {
      this.flakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: r(.25, this.radiusMax, 100),
        density: r(1, 100),
      });
    }
  }

  private draw() {
    if (!this.ctx || !this.canvas || !this.connected) {
      return;
    }
    if (!this.flakes?.length || this.numOfFlakes !== this.flakes.length) {
      this.generateFlakes();
    }
    this.currentAngle += 0.001;
    this.canvas.width = this.canvas.width;
    this.canvas.height = this.canvas.height;
    this.ctx.fillStyle = 'rgba(255, 255, 255, .75)';
    this.ctx.beginPath();
    for (const flake of this.flakes) {
      this.ctx.moveTo(flake.x, flake.y);
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

      flake.y += Math.cos(this.currentAngle + flake.density) + 1 + (flake.radius / 2);
      flake.x += Math.sin(this.currentAngle) * 2;
      if (flake.x > this.canvas.width + (flake.radius * 3)) {
        flake.x = -(flake.radius * 3);
      } else if (flake.x < -(flake.radius * 3)) {
        flake.x = this.canvas.width + (flake.radius * 3);
      } else if (flake.y > this.canvas.height) {
        flake.x = Math.random() * this.canvas.width;
        flake.y = -(flake.radius * 3);
      }
    }
    this.ctx.fill();

    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

}
customElements.define("rgthree-snow", SnowCanvas);
