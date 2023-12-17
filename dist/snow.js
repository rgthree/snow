"use strict";
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
 */function r(t,s,i=1){return t*=i,s*=i,(Math.floor(Math.random()*(s-t+1))+t)/i}class SnowCanvas extends HTMLElement{constructor(){super(),this.connected=!1,this.canvas=null,this.ctx=null,this.numOfFlakes=500,this.radiusMax=3,this.currentAngle=1,this.flakes=[],window.addEventListener("resize",()=>{this.canvas&&(this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight)})}connectedCallback(){var t=this.attachShadow({mode:"closed"}),s=(this.canvas=document.createElement("canvas"),this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,this.ctx=this.canvas.getContext("2d"),document.createElement("style"));s.textContent="      canvas {         position: fixed;         top: 0;         left: 0;         width: 100%;         height: 100%;         z-index: 99999;         pointer-events: none;       }",t.appendChild(s),t.appendChild(this.canvas),this.connected=!0,window.requestAnimationFrame(()=>{this.draw()})}disconnectedCallback(){this.connected=!1}attributeChangedCallback(t,s,i){"flakes"===t&&(this.numOfFlakes=Number(i)||500)}generateFlakes(){if(this.ctx&&this.canvas&&this.connected){this.flakes=[];for(let t=0;t<this.numOfFlakes;t++)this.flakes.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,radius:r(.25,this.radiusMax,100),density:r(1,100)})}}draw(){var t;if(this.ctx&&this.canvas&&this.connected){null!=(t=this.flakes)&&t.length&&this.numOfFlakes===this.flakes.length||this.generateFlakes(),this.currentAngle+=.001,this.canvas.width=this.canvas.width,this.canvas.height=this.canvas.height,this.ctx.fillStyle="rgba(255, 255, 255, .75)",this.ctx.beginPath();for(const s of this.flakes)this.ctx.moveTo(s.x,s.y),this.ctx.arc(s.x,s.y,s.radius,0,2*Math.PI),s.y+=Math.cos(this.currentAngle+s.density)+1+s.radius/2,s.x+=2*Math.sin(this.currentAngle),s.x>this.canvas.width+3*s.radius?s.x=-3*s.radius:s.x<-3*s.radius?s.x=this.canvas.width+3*s.radius:s.y>this.canvas.height&&(s.x=Math.random()*this.canvas.width,s.y=-3*s.radius);this.ctx.fill(),window.requestAnimationFrame(()=>{this.draw()})}}}SnowCanvas.observedAttributes=["flakes"],customElements.define("rgthree-snow",SnowCanvas);