document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("inputField");
    const addToDoButton = document.getElementById("addToDo");
    const toDoContainer = document.getElementById("toDoContainer");
    const alertMessage = document.getElementById("alertMessage");
    const celebrationScreen = document.getElementById("celebration-screen");
    const confettiCanvas = document.getElementById("confettiCanvas");
    const taskCounter = document.getElementById("taskCounter");
    const currentDate = document.getElementById("currentDate");

    // Set current date
    const now = new Date();
    currentDate.innerText = now.toDateString();

    // Add task
    addToDoButton.addEventListener("click", addItem);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addItem();
    });

    function addItem() {
        const taskText = inputField.value.trim();
        if (taskText === "") {
            alertMessage.style.display = "block";
            return;
        }
        alertMessage.style.display = "none";

        const taskItem = document.createElement("div");
        taskItem.classList.add("item");

        // Task text
        const taskSpan = document.createElement("span");
        taskSpan.innerText = taskText;
        taskSpan.classList.add("task-text");

        // Strike-through toggle
        taskSpan.addEventListener("click", () => {
            taskSpan.classList.toggle("text-decoration-line-through");
            checkAllCompleted();
            updateCounter();
        });

        // Edit button
        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-warning");
        editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // Append elements
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        toDoContainer.appendChild(taskItem);

        inputField.value = "";
        updateCounter();

        // Edit functionality
        editButton.addEventListener("click", () => {
            if (editButton.innerHTML.includes("pencil")) {
                editButton.innerHTML = '<i class="fa-solid fa-check"></i>';
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.classList.add("form-control");
                editInput.value = taskSpan.innerText;
                taskItem.replaceChild(editInput, taskSpan);
                editInput.focus();
            } else {
                editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
                const newText = taskItem.querySelector("input").value.trim();
                taskSpan.innerText = newText || taskText;
                taskItem.replaceChild(taskSpan, taskItem.querySelector("input"));
            }
        });

        // Delete functionality
        deleteButton.addEventListener("click", () => {
            taskItem.remove();
            checkAllCompleted();
            updateCounter();
        });
    }

    function updateCounter() {
        const totalTasks = document.querySelectorAll(".item").length;
        taskCounter.innerText = `Tasks: ${totalTasks}`;
    }

    function checkAllCompleted() {
        const allTasks = document.querySelectorAll(".task-text");
        const allCompleted = Array.from(allTasks).every(task => task.classList.contains("text-decoration-line-through"));

        if (allCompleted && allTasks.length > 0) {
            showCelebration();
        }
    }

    function showCelebration() {
        celebrationScreen.style.display = "flex";
        launchConfetti();

        setTimeout(() => {
            celebrationScreen.style.display = "none";
        }, 2500);
    }

    // Simple Confetti Effect
    function launchConfetti() {
        const ctx = confettiCanvas.getContext("2d");
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        let confettiParticles = [];

        for (let i = 0; i < 150; i++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height,
                r: Math.random() * 6 + 2,
                d: Math.random() * 15,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                tilt: Math.random() * 10 - 10
            });
        }

        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiParticles.forEach(p => {
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });
            update();
        }

        function update() {
            confettiParticles.forEach(p => {
                p.y += Math.cos(0.01 + p.d) + 2 + p.r / 2;
                p.x += Math.sin(0.01) * 2;
                p.tilt += 0.1;
                if (p.y > confettiCanvas.height) {
                    p.y = -10;
                    p.x = Math.random() * confettiCanvas.width;
                }
            });
        }

        let confettiInterval = setInterval(draw, 20);
        setTimeout(() => clearInterval(confettiInterval), 2500);
    }
});