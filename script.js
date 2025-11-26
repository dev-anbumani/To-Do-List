document.addEventListener("DOMContentLoaded", () => {
  // App DOM
  const inputField = document.getElementById("inputField");
  const addToDoButton = document.getElementById("addToDo");
  const toDoContainer = document.getElementById("toDoContainer");
  const alertMessage = document.getElementById("alertMessage");
  const taskCounter = document.getElementById("taskCounter");
  const celebrationScreen = document.getElementById("celebration-screen");
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");

  // Set date
const dateEl = document.getElementById("currentDate");
const now = new Date();

const optionsMonth = { month: 'short' };
const optionsYear = { year: 'numeric' };
const optionsDay = { day: 'numeric' };

const month = now.toLocaleDateString('en-US', optionsMonth);
const day = now.toLocaleDateString('en-US', optionsDay);
const year = now.toLocaleDateString('en-US', optionsYear);

dateEl.innerHTML = `<span class="month">${month}</span><span class="day">${day}</span><span class="year">${year}</span>`;



  // Basic to-do app behavior (add/edit/delete)
  addToDoButton.addEventListener("click", addTask);
  inputField.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });

  function addTask() {
    const text = inputField.value.trim();
    if (!text) { alertMessage.style.display = "block"; return; }
    alertMessage.style.display = "none";

    const item = document.createElement("div"); item.className = "item";
    const span = document.createElement("span"); span.className = "task-text"; span.innerText = text;

    span.addEventListener("click", () => { 
      span.classList.toggle("text-decoration-line-through"); 
      checkAllCompleted(); 
    });

    const editBtn = document.createElement("button"); editBtn.className = "btn btn-warning me-2";
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    const deleteBtn = document.createElement("button"); deleteBtn.className = "btn btn-danger";
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    editBtn.addEventListener("click", () => {
      if (editBtn.innerHTML.includes("pencil")) {
        editBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        const input = document.createElement("input"); 
        input.type = "text"; 
        input.value = span.innerText; 
        input.className = "form-control";
        item.replaceChild(input, span); 
        input.focus();
      } else {
        editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        const newText = item.querySelector("input").value.trim();
        span.innerText = newText || text;
        item.replaceChild(span, item.querySelector("input"));
      }
    });

    deleteBtn.addEventListener("click", () => { 
      item.remove(); 
      updateCounter(); 
      checkAllCompleted(); 
    });

    item.appendChild(span); 
    item.appendChild(editBtn); 
    item.appendChild(deleteBtn);
    toDoContainer.appendChild(item); 
    inputField.value = ""; 
    updateCounter();
  }

  function updateCounter() {
    const total = document.querySelectorAll(".item").length; 
    taskCounter.innerText = `Tasks: ${total}`;
  }

  function checkAllCompleted() {
    const allTasks = document.querySelectorAll(".task-text");
    const done = Array.from(allTasks).every(t => t.classList.contains("text-decoration-line-through"));
    if (done && allTasks.length > 0) showCelebration();
  }

  // ---------- Celebration logic ----------
  let rafId = null;
  function showCelebration() {
    // show overlay
    celebrationScreen.style.display = "flex";
    resizeCanvas();
    startPremiumFireworks();   // start animation
    // hide after 4s exactly
    setTimeout(() => {
      cancelAnimationFrame(rafId);
      clearCanvas();
      celebrationScreen.style.display = "none";
    }, 2000);
  }

  // canvas resizing helper
  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", () => { if (celebrationScreen.style.display === "flex") resizeCanvas(); });

  function clearCanvas() { ctx.clearRect(0,0,canvas.width,canvas.height); }

  // ---------- Particles system (fast, premium) ----------
  function startPremiumFireworks() {
    resizeCanvas();

    const particles = []; // all particles
    const trails = [];    // small trailing particles for motion blur
    const heartParticles = []; // glitter hearts (larger shaped hearts)

    // create multiple heart bursts quickly (fast)
    const bursts = 5;
    for (let b = 0; b < bursts; b++) {
      setTimeout(() => createBigHeartBurst(), b * 120); // stagger bursts quickly
    }

    // create small glitter hearts continuously (fast) for short time
    for (let i = 0; i < 30; i++) {
      setTimeout(() => spawnGlitterHeart(), i * 90);
    }

    let startTime = performance.now();

    function createBigHeartBurst() {
      const x = Math.random() * canvas.width / devicePixelRatio;
      const y = Math.random() * (canvas.height / devicePixelRatio) * 0.35 + 40;
      // big heart outline points using param equation — create spark particles along shape
      const count = 120;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        // parametric heart (normalized)
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const speed = Math.random() * 5 + 5; // FAST
        const vx = hx * 0.09 * speed;
        const vy = -hy * 0.09 * speed;
        const size = Math.random() * 2.5 + 1.5;
        const hue = 320 + Math.random()*40 - 20; // peach-lavender range
        particles.push({ x, y, vx, vy, size, life:1.0, fade:0.02 + Math.random()*0.02, hue });
        // trails spawn tied to particle initial motion
        for (let tI=0; tI<2; tI++) {
          trails.push({ x, y, vx: vx*0.2 + (Math.random()-0.5)*0.6, vy: vy*0.2 + (Math.random()-0.5)*0.6, size: Math.random()*1.8+0.6, life:0.7 });
        }
      }
      // extra small sparks
      for (let s=0; s<30; s++) {
        const sx = x + (Math.random()-0.5)*30;
        const sy = y + (Math.random()-0.5)*30;
        const svx = (Math.random()-0.5)*6;
        const svy = (Math.random()-0.5)*6;
        particles.push({ x:sx, y:sy, vx:svx, vy:svy, size: Math.random()*2+1, life:0.9, fade:0.03, hue: 290 + Math.random()*120 });
      }
    }

    // glitter heart shape spawns (bigger hearts, slower fade)
    function spawnGlitterHeart() {
      const x = Math.random() * canvas.width / devicePixelRatio;
      const y = -20; // fall from top
      const vx = (Math.random()-0.5)*2;
      const vy = Math.random()*3 + 2;
      const size = Math.random()*8 + 6;
      heartParticles.push({ x, y, vx, vy, size, alpha:1, drift: (Math.random()-0.5)*0.6 });
    }

    // draw small heart shape function (vector)
    function drawHeartShape(ctxLocal, x, y, size, fillStyle, alpha=1) {
      ctxLocal.save();
      ctxLocal.translate(x, y);
      ctxLocal.scale(size/14, size/14);
      ctxLocal.globalAlpha = alpha;
      ctxLocal.beginPath();
      ctxLocal.moveTo(0, 3);
      ctxLocal.bezierCurveTo(-5, -3, -14, 3, 0, 14);
      ctxLocal.bezierCurveTo(14, 3, 5, -3, 0, 3);
      ctxLocal.closePath();
      ctxLocal.fillStyle = fillStyle;
      ctxLocal.fill();
      ctxLocal.restore();
    }

    // main loop via rAF
    function loop(now) {
      clearCanvas();
      // update & draw particles
      for (let i = particles.length -1; i >=0; i--) {
        const p = particles[i];
        // gravity + slight drag
        p.vy += 0.12; // gravity (fast falling)
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.fade;
        // draw spark (small circle)
        ctx.globalAlpha = Math.max(0, p.life);
        // color blends peach-lavender with random hue
        const color = `hsl(${p.hue}, 85%, ${55 + Math.random()*10}%)`;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        // spawn tiny trailing particles occasionally
        if (Math.random() < 0.08) {
          trails.push({ x: p.x, y: p.y, vx: -p.vx*0.2 + (Math.random()-0.5)*0.6, vy: -p.vy*0.2 + (Math.random()-0.5)*0.6, size: Math.random()*1.2+0.4, life:0.5 });
        }
        if (p.life <= 0 || p.y > canvas.height/devicePixelRatio+40) {
          particles.splice(i,1);
        }
      }

      // trails (soft glowing dots)
      for (let i = trails.length-1; i >=0; i--) {
        const t = trails[i];
        t.vy += 0.08;
        t.x += t.vx; t.y += t.vy; t.life -= 0.02;
        ctx.globalAlpha = Math.max(0, t.life*0.9);
        // soft pale spark
        ctx.fillStyle = `rgba(255,220,240,0.9)`;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.size, 0, Math.PI*2); ctx.fill();
        if (t.life <= 0) trails.splice(i,1);
      }

      // glitter heart particles falling (bigger hearts)
      for (let i = heartParticles.length -1; i >= 0; i--) {
        const h = heartParticles[i];
        h.vy += 0.08;
        h.x += h.vx; h.y += h.vy; h.vx += h.drift*0.02;
        // shimmer fill using gradient-like hsl shift
        const hue = 320 + Math.sin((now + i*20)/200)*40;
        drawHeartShape(ctx, h.x, h.y, h.size, `hsl(${hue},85%,62%)`, Math.max(0, h.alpha));
        // small trail behind heart
        if (Math.random() < 0.2) {
          trails.push({ x: h.x + (Math.random()-0.5)*4, y: h.y + (Math.random()-0.5)*4, vx: (Math.random()-0.5)*0.6, vy: (Math.random()*0.6), size: Math.random()*1.4+0.3, life: 0.6 });
        }
        // fade & remove
        h.alpha -= 0.01;
        if (h.y > canvas.height/devicePixelRatio + 30 || h.alpha <= 0) heartParticles.splice(i,1);
      }

      // subtle overlay glow rings (fast small flashes) — optional cosmetic
      if (Math.random() < 0.02) {
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = `rgba(255,200,230,0.03)`;
        ctx.beginPath();
        const rx = Math.random()*canvas.width/devicePixelRatio;
        const ry = Math.random()*canvas.height/devicePixelRatio;
        ctx.arc(rx, ry, Math.random()*80+30, 0, Math.PI*2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      rafId = requestAnimationFrame(loop);
    }

    // start drawing
    rafId = requestAnimationFrame(loop);
  }
  
  // End of script
});

/* -----------------------------------------------------
   HOW-TO-USE MODAL + ONBOARDING LOGIC  
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const howToUseModal = new bootstrap.Modal(document.getElementById('howToUseModal'));
  const infoIcon = document.getElementById("infoIcon");
  const helpFloatBtn = document.getElementById("helpFloatBtn");

  /* ---------------------------------------------
     1️⃣  OPEN MODAL WHEN USER CLICKS INFO ICON
  ---------------------------------------------- */
  infoIcon.addEventListener("click", () => {
    howToUseModal.show();
  });

  /* ---------------------------------------------
     2️⃣  OPEN MODAL WHEN USER CLICKS FLOATING HELP BUTTON
  ---------------------------------------------- */
  helpFloatBtn.addEventListener("click", () => {
    howToUseModal.show();
  });

  /* ---------------------------------------------
     3️⃣  AUTO-SHOW MODAL ON FIRST VISIT ONLY
  ---------------------------------------------- */
  if (!localStorage.getItem("todo_first_time_help")) {
    setTimeout(() => {
      howToUseModal.show();
    }, 600);

    localStorage.setItem("todo_first_time_help", "true");
  }

  /* ---------------------------------------------
     OPTIONAL: FLOAT BUTTON BOUNCE ANIMATION
  ---------------------------------------------- */
  setTimeout(() => {
    helpFloatBtn.style.transition = "transform 0.25s ease";
    helpFloatBtn.style.transform = "scale(1.15)";
    setTimeout(() => {
      helpFloatBtn.style.transform = "scale(1)";
    }, 250);
  }, 1500);
});

