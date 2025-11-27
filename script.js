document.addEventListener("DOMContentLoaded", () => {

  // ================== APP DOM ==================
  const inputField = document.getElementById("inputField");
  const addToDoButton = document.getElementById("addToDo");
  const toDoContainer = document.getElementById("toDoContainer");
  const alertMessage = document.getElementById("alertMessage");
  const taskCounter = document.getElementById("taskCounter");
  const celebrationScreen = document.getElementById("celebration-screen");
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");

  // =============== DATE DISPLAY =================
  const dateEl = document.getElementById("currentDate");
  const now = new Date();
  const optionsMonth = { month: 'short' };
  const optionsYear = { year: 'numeric' };
  const optionsDay = { day: 'numeric' };
  const month = now.toLocaleDateString('en-US', optionsMonth);
  const day = now.toLocaleDateString('en-US', optionsDay);
  const year = now.toLocaleDateString('en-US', optionsYear);
  dateEl.innerHTML = `<span class="month">${month}</span><span class="day">${day}</span><span class="year">${year}</span>`;

  // ============== LOCAL STORAGE =================
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".item").forEach(item => {
      const text = item.querySelector(".task-text").innerText;
      const completed = item.querySelector(".task-text").classList.contains("text-decoration-line-through");
      tasks.push({ text, completed });
    });
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("todo_tasks")) || [];
    saved.forEach(task => addTask(task.text, task.completed, true));
  }

  // ================= TO-DO CORE =================
  addToDoButton.addEventListener("click", () => addTask());
  inputField.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });

  function addTask(text = null, completed = false, loading = false) {
    const finalText = text || inputField.value.trim();
    if (!finalText) {
      alertMessage.style.display = "block";
      return;
    }
    alertMessage.style.display = "none";

    const item = document.createElement("div");
    item.className = "item";

    const span = document.createElement("span");
    span.className = "task-text";
    span.innerText = finalText;
    if (completed) span.classList.add("text-decoration-line-through");

    span.addEventListener("click", () => {
      span.classList.toggle("text-decoration-line-through");
      updateCounter();
      saveTasks();
      checkAllCompleted();
    });

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning me-2";
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
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
        span.innerText = newText || finalText;
        item.replaceChild(span, item.querySelector("input"));
        saveTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.addEventListener("click", () => {
      item.remove();
      updateCounter();
      saveTasks();
      checkAllCompleted();
    });

    item.appendChild(span);
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    toDoContainer.appendChild(item);

    if (!loading) inputField.value = "";
    updateCounter();
    if (!loading) saveTasks();
  }

  function updateCounter() {
    const total = document.querySelectorAll(".item").length;
    taskCounter.innerText = `Tasks: ${total}`;
  }

  function checkAllCompleted() {
    const tasks = document.querySelectorAll(".task-text");
    if (tasks.length === 0) return;
    const done = [...tasks].every(t => t.classList.contains("text-decoration-line-through"));
    if (done) showCelebration();
  }

  // ================= CELEBRATION =================
  let rafId = null;

  function showCelebration() {
    celebrationScreen.style.display = "flex";
    resizeCanvas();
    startPremiumFireworks();
    setTimeout(() => {
      cancelAnimationFrame(rafId);
      clearCanvas();
      celebrationScreen.style.display = "none";
    }, 2000);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  window.addEventListener("resize", () => {
    if (celebrationScreen.style.display === "flex") resizeCanvas();
  });

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ================= FIREWORK ENGINE =================
  function startPremiumFireworks() {
    resizeCanvas();
    const particles = [];
    const trails = [];
    const heartParticles = [];

    for (let b = 0; b < 5; b++) setTimeout(() => createBigHeartBurst(), b * 120);
    for (let i = 0; i < 30; i++) setTimeout(() => spawnGlitterHeart(), i * 90);

    function createBigHeartBurst() {
      const x = Math.random() * canvas.width / devicePixelRatio;
      const y = Math.random() * canvas.height / devicePixelRatio * 0.35 + 40;
      const count = 120;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const speed = Math.random() * 5 + 5;
        const vx = hx * 0.09 * speed;
        const vy = -hy * 0.09 * speed;
        const size = Math.random() * 2.5 + 1.5;
        const hue = 320 + Math.random()*40 - 20;
        particles.push({ x, y, vx, vy, size, life:1.0, fade:0.02 + Math.random()*0.02, hue });
        for (let tI = 0; tI < 2; tI++) trails.push({
          x, y,
          vx: vx*0.2 + (Math.random()-0.5)*0.6,
          vy: vy*0.2 + (Math.random()-0.5)*0.6,
          size: Math.random()*1.8 + 0.6,
          life: 0.7
        });
      }
    }

    function spawnGlitterHeart() {
      const x = Math.random() * canvas.width / devicePixelRatio;
      const y = -20;
      const vx = (Math.random()-0.5)*2;
      const vy = Math.random()*3 + 2;
      const size = Math.random()*8 + 6;
      heartParticles.push({ x, y, vx, vy, size, alpha:1, drift:(Math.random()-0.5)*0.6 });
    }

    function drawHeartShape(ctx2, x, y, size, fill, alpha=1) {
      ctx2.save();
      ctx2.translate(x, y);
      ctx2.scale(size/14, size/14);
      ctx2.globalAlpha = alpha;
      ctx2.beginPath();
      ctx2.moveTo(0, 3);
      ctx2.bezierCurveTo(-5,-3,-14,3,0,14);
      ctx2.bezierCurveTo(14,3,5,-3,0,3);
      ctx2.closePath();
      ctx2.fillStyle = fill;
      ctx2.fill();
      ctx2.restore();
    }

    function loop(now) {
      clearCanvas();
      for (let i = particles.length-1; i>=0; i--) {
        const p = particles[i];
        p.vy += 0.12; p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx; p.y += p.vy; p.life -= p.fade;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsl(${p.hue},85%,${55 + Math.random()*10}%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        if (Math.random() < 0.08) trails.push({ x: p.x, y: p.y, vx: -p.vx*0.2 + (Math.random()-0.5)*0.6, vy: -p.vy*0.2 + (Math.random()-0.5)*0.6, size: Math.random()*1.2+0.4, life:0.5 });
        if (p.life <= 0 || p.y > canvas.height/devicePixelRatio + 40) particles.splice(i,1);
      }

      for (let i = trails.length-1; i>=0; i--) {
        const t = trails[i];
        t.vy += 0.08; t.x += t.vx; t.y += t.vy; t.life -= 0.02;
        ctx.globalAlpha = Math.max(0, t.life*0.9);
        ctx.fillStyle = `rgba(255,220,240,0.9)`;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.size, 0, Math.PI*2); ctx.fill();
        if (t.life <= 0) trails.splice(i,1);
      }

      for (let i = heartParticles.length-1; i>=0; i--) {
        const h = heartParticles[i];
        h.vy += 0.08; h.x += h.vx; h.y += h.vy; h.vx += h.drift*0.02;
        const hue = 320 + Math.sin((now + i*20)/200)*40;
        drawHeartShape(ctx, h.x, h.y, h.size, `hsl(${hue},85%,62%)`, Math.max(0, h.alpha));
        if (Math.random() < 0.2) trails.push({ x:h.x+(Math.random()-0.5)*4, y:h.y+(Math.random()-0.5)*4, vx:(Math.random()-0.5)*0.6, vy:(Math.random()*0.6), size: Math.random()*1.4+0.3, life:0.6 });
        h.alpha -= 0.01;
        if (h.y > canvas.height/devicePixelRatio + 30 || h.alpha <= 0) heartParticles.splice(i,1);
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
  }

  loadTasks();
});

// ================= HOW TO USE MODAL / ONBOARDING =================
document.addEventListener("DOMContentLoaded", () => {
  const howToUseModalEl = document.getElementById('howToUseModal');
  const howToUseModal = new bootstrap.Modal(howToUseModalEl);
  const infoIcon = document.getElementById("infoIcon");
  const helpFloatBtn = document.getElementById("helpFloatBtn");
  const carouselEl = document.getElementById('tutorialCarousel');

  function showOnboardingModal() {
    if (carouselEl) {
      const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
      bsCarousel.to(0); // first slide
    }
    howToUseModal.show();
  }

  infoIcon.addEventListener("click", showOnboardingModal);
  helpFloatBtn.addEventListener("click", showOnboardingModal);

  if (!localStorage.getItem("todo_first_time_help")) {
    setTimeout(() => {
      showOnboardingModal();
    }, 600);
    localStorage.setItem("todo_first_time_help", "true");
  }

  // Floating button bounce effect
  setTimeout(() => {
    helpFloatBtn.style.transition = "transform 0.25s ease";
    helpFloatBtn.style.transform = "scale(1.15)";
    setTimeout(() => helpFloatBtn.style.transform = "scale(1)", 250);
  }, 1500);
});

// ================= TUTORIAL CAROUSEL =================
document.addEventListener('DOMContentLoaded', () => {
  const carouselEl = document.getElementById('tutorialCarousel');
  if (!carouselEl) return;

  const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
  const indicatorLines = document.querySelectorAll('.step-indicator .line');

  function setActiveIndicator(index) {
    indicatorLines.forEach((el, i) => {
      el.classList.toggle('active', i === index);
      if (i === index) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }

  const initialIndex = [...carouselEl.querySelectorAll('.carousel-item')].findIndex(item => item.classList.contains('active'));
  setActiveIndicator(initialIndex >= 0 ? initialIndex : 0);

  carouselEl.addEventListener('slid.bs.carousel', (e) => setActiveIndicator(e.to));

  indicatorLines.forEach((el, i) => {
    el.addEventListener('click', () => bsCarousel.to(i));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bsCarousel.to(i); }
    });
  });
});
