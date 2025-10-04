// WebGL Shader Background - Ink-like living residue effect
// Simplified implementation, performance-conscious

let gl, program, positionBuffer, timeUniform, resolutionUniform;
let shaderCanvas, isShaderRunning = false;

const SHADER_CONFIG = {
  enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  storageKey: 'hethar_shader_enabled'
};

function initWebGLShader() {
  if (!SHADER_CONFIG.enabled) return;
  if (localStorage.getItem(SHADER_CONFIG.storageKey) === '0') return;
  
  shaderCanvas = document.createElement('canvas');
  shaderCanvas.id = 'shaderCanvas';
  shaderCanvas.style.cssText = `
    position:fixed;
    inset:0;
    pointer-events:none;
    mix-blend-mode:screen;
    opacity:0.06;
    z-index:1;
  `;
  document.body.appendChild(shaderCanvas);
  
  gl = shaderCanvas.getContext('webgl');
  if (!gl) return console.log('[Shader] WebGL not supported');
  
  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
    }
  `;
  
  // Fragment shader - ink-like flow effect
  const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      
      float t = u_time * 0.0003;
      
      // Slow ink flow
      float flow = sin(p.x * 2.0 + t) * cos(p.y * 3.0 - t * 0.5);
      flow += noise(p * 10.0 + vec2(t)) * 0.3;
      
      // Green ink color
      vec3 color = vec3(0.0, 1.0, 0.5) * (flow * 0.5 + 0.5);
      
      gl_FragColor = vec4(color, 0.4);
    }
  `;
  
  // Compile shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  // Create program
  program = createProgram(gl, vertexShader, fragmentShader);
  
  // Get locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  timeUniform = gl.getUniformLocation(program, 'u_time');
  resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
  
  // Create buffer
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  // Setup
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  // Resize
  resizeShaderCanvas();
  window.addEventListener('resize', resizeShaderCanvas);
  
  // Start render loop
  isShaderRunning = true;
  renderShader();
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function resizeShaderCanvas() {
  if (!shaderCanvas) return;
  shaderCanvas.width = window.innerWidth;
  shaderCanvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function renderShader() {
  if (!isShaderRunning) return;
  
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.useProgram(program);
  gl.uniform1f(timeUniform, Date.now());
  gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  
  requestAnimationFrame(renderShader);
}

function stopShader() {
  isShaderRunning = false;
  if (shaderCanvas) shaderCanvas.remove();
}

// Export
window.WebGLShader = {
  init: initWebGLShader,
  stop: stopShader
};

// Auto-init after page load (less intrusive)
if (document.readyState === 'complete') {
  setTimeout(initWebGLShader, 2000);
} else {
  window.addEventListener('load', () => setTimeout(initWebGLShader, 2000));
}

