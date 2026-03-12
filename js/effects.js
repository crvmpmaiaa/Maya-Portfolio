/* ============================================
   maiaa.ai — Premium Interactive Effects
   ============================================ */

const Effects = (() => {

  /* --- Custom Cursor --- */
  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.getElementById('cursorDot');
    const circle = document.getElementById('cursorCircle');
    if (!dot || !circle) return;

    const xDot = gsap.quickTo(dot, 'left', { duration: 0.1, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'top', { duration: 0.1, ease: 'power2.out' });
    const xCircle = gsap.quickTo(circle, 'left', { duration: 0.35, ease: 'power2.out' });
    const yCircle = gsap.quickTo(circle, 'top', { duration: 0.35, ease: 'power2.out' });

    document.addEventListener('mousemove', (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xCircle(e.clientX);
      yCircle(e.clientY);
    });

    document.body.classList.add('cursor-ready');

    const hoverTargets = 'a, button, [data-tilt], [data-magnetic], input, textarea';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => circle.classList.add('hovering'));
      el.addEventListener('mouseleave', () => circle.classList.remove('hovering'));
    });
  }

  /* --- 3D Tilt Cards --- */
  function initTiltCards() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
      const glare = card.querySelector('.service-card-glare') || card.querySelector('.portfolio-card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glare) {
          const gx = ((e.clientX - rect.left) / rect.width) * 100;
          const gy = ((e.clientY - rect.top) / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(0, 229, 255, 0.12), transparent 60%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform'
        });
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });
  }

  /* --- Magnetic Buttons --- */
  function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  /* --- Gradient Mesh Background --- */
  function initGradientMesh(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const blobCount = options.blobCount || 5;
    const speed = options.speed || 0.3;

    const colors = [
      { r: 0, g: 229, b: 255 },     // cyan
      { r: 123, g: 97, b: 255 },     // violet
      { r: 0, g: 100, b: 200 },      // deep blue
      { r: 0, g: 180, b: 220 },      // teal
      { r: 80, g: 60, b: 200 },      // indigo
    ];

    const blobs = [];
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.25 + Math.random() * 0.2,
        vx: (Math.random() - 0.5) * speed * 0.004,
        vy: (Math.random() - 0.5) * speed * 0.004,
        color: colors[i % colors.length]
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x < -0.2 || blob.x > 1.2) blob.vx *= -1;
        if (blob.y < -0.2 || blob.y > 1.2) blob.vy *= -1;

        const cx = blob.x * canvas.width;
        const cy = blob.y * canvas.height;
        const r = blob.radius * Math.max(canvas.width, canvas.height);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.25)`);
        grad.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  /* --- WebGL Shader Background --- */
  function initShaderBackground(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed = 0.2;
      const float gridSmoothWidth = 0.015;
      const float axisWidth = 0.05;
      const float majorLineWidth = 0.025;
      const float minorLineWidth = 0.0125;
      const float majorLineFrequency = 5.0;
      const float minorLineFrequency = 1.0;
      const float scale = 5.0;
      const vec4 lineColor = vec4(0.0, 0.6, 0.9, 1.0);
      const float minLineWidth = 0.01;
      const float maxLineWidth = 0.2;
      const float lineSpeed = 1.0 * overallSpeed;
      const float lineAmplitude = 1.0;
      const float lineFrequency = 0.2;
      const float warpSpeed = 0.2 * overallSpeed;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float offsetFrequency = 0.5;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float minOffsetSpread = 0.6;
      const float maxOffsetSpread = 2.0;
      const int linesPerGroup = 16;

      #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
      #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float horizontalFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 space = (gl_FragCoord.xy - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

        float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
        float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

        vec4 lines = vec4(0.0);
        vec4 bgColor1 = vec4(0.02, 0.05, 0.15, 1.0);
        vec4 bgColor2 = vec4(0.05, 0.15, 0.3, 1.0);

        for(int l = 0; l < linesPerGroup; l++) {
          float normalizedLineIndex = float(l) / float(linesPerGroup);
          float offsetTime = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
          float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
          float linePosition = getPlasmaY(space.x, horizontalFade, offset);
          float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

          float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
          float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

          line = line + circle;
          lines += line * lineColor * rand;
        }

        vec4 fragColor = mix(bgColor1, bgColor2, uv.x);
        fragColor *= verticalFade;
        fragColor.a = 1.0;
        fragColor += lines;

        gl_FragColor = fragColor;
      }
    `;

    function loadShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = loadShader(gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const posLoc = gl.getAttribLocation(program, 'aVertexPosition');
    const resLoc = gl.getUniformLocation(program, 'iResolution');
    const timeLoc = gl.getUniformLocation(program, 'iTime');

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    const startTime = performance.now();

    function render() {
      const t = (performance.now() - startTime) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* --- Text Split (wrap each word in a span for animation) --- */
  function splitText(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const words = el.textContent.split(/\s+/);
      el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    });
  }

  return {
    initCustomCursor,
    initTiltCards,
    initMagneticButtons,
    initGradientMesh,
    initShaderBackground,
    splitText
  };

})();
