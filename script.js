document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("inputField");
    const addToDoButton = document.getElementById("addToDo");
    const toDoContainer = document.getElementById("toDoContainer");
    const alertMessage = document.getElementById("alertMessage");
    const taskCounter = document.getElementById("taskCounter");

    const celebrationScreen = document.getElementById("celebration-screen");
    const confettiCanvas = document.getElementById("confettiCanvas");

    // Set Date
    document.getElementById("currentDate").innerText = new Date().toDateString();

    // Add task
    addToDoButton.addEventListener("click", addTask);
    inputField.addEventListener("keypress", e => {
        if (e.key === "Enter") addTask();
    });

    function addTask() {
        const text = inputField.value.trim();

        if (text === "") {
            alertMessage.style.display = "block";
            return;
        }
        alertMessage.style.display = "none";

        const item = document.createElement("div");
        item.classList.add("item");

        const span = document.createElement("span");
        span.classList.add("task-text");
        span.innerText = text;

        span.addEventListener("click", () => {
            span.classList.toggle("text-decoration-line-through");
            checkAllCompleted();
        });

        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "btn-warning", "me-2");
        editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        // Edit
        editBtn.addEventListener("click", () => {
            if (editBtn.innerHTML.includes("pencil")) {
                editBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;

                const input = document.createElement("input");
                input.type = "text";
                input.value = span.innerText;
                input.classList.add("form-control");

                item.replaceChild(input, span);
                input.focus();

            } else {
                editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
                const newText = item.querySelector("input").value.trim();

                span.innerText = newText || text;
                item.replaceChild(span, item.querySelector("input"));
            }
        });

        // Delete
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
        const done = Array.from(allTasks).every(t =>
            t.classList.contains("text-decoration-line-through")
        );

        if (done && allTasks.length > 0) showCelebration();
    }

    function showCelebration() {
        celebrationScreen.style.display = "flex";
        launchConfetti();

        setTimeout(() => {
            celebrationScreen.style.display = "none";
        }, 2500);
    }

    function launchConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    let particles = [];

    // Create 250 confetti particles
    for (let i = 0; i < 250; i++) {

        // random starting positions (top, left, or right)
        let startX;
        let startY;

        const side = Math.floor(Math.random() * 3); 
        // 0 = top, 1 = left, 2 = right

        if (side === 0) { 
            startX = Math.random() * confettiCanvas.width; 
            startY = -20;
        } 
        else if (side === 1) { 
            startX = -20;
            startY = Math.random() * confettiCanvas.height;
        } 
        else { 
            startX = confettiCanvas.width + 20;
            startY = Math.random() * confettiCanvas.height;
        }

        particles.push({
            x: startX,
            y: startY,
            r: Math.random() * 6 + 4,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,

            // random falling direction
            vx: (Math.random() - 0.5) * 8,  // horizontal movement  
            vy: Math.random() * 8 + 4,      // vertical speed (fast)
        });
    }

    function draw() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.r, p.r); // SQUARE confetti
        });

        update();
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx; // natural left-right fall
            p.y += p.vy; // downward velocity

            // Respawn when out of screen
            if (
                p.x < -50 || 
                p.x > confettiCanvas.width + 50 || 
                p.y > confettiCanvas.height + 50
            ) {
                p.x = Math.random() * confettiCanvas.width;
                p.y = -20;
            }
        });
    }

    let interval = setInterval(draw, 20);
    setTimeout(() => clearInterval(interval), 4000); // 4 sec confetti
}
});