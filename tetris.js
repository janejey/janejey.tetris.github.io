const items = document.getElementsByClassName("item");
const container = document.getElementById("container");
const button = document.getElementById("startGame");
const scoreCalc = document.getElementById("score");
const item = items[0];
const rowCount = 20;
const columnCount = 10;
let currentCoord = Math.floor(columnCount / 2 - 1)
let currentPosition = 0
const allCubesCount = rowCount * columnCount;
container.style.height = rowCount * 30 + 'px';
container.style.width = columnCount * 30 + 'px';
let colorArr = ["#C6808C", "#6D5B87", "#44364B", "#EC745C", "#F5AD8C"];
let randomColor;
let timer;
let score = 0;


const GAME_STATES = {
    initial: "initial",
    playing: "playing",
    paused: "paused",
    finished: "finished"
}
let state = GAME_STATES.initial;
for (let i = 1; i < allCubesCount + 10; i++) {
    const clonedItem = item.cloneNode();
    clonedItem.dataset.coord = i;
    container.append(clonedItem);
}
let arrFromItems = Array.from(items)
document.body.addEventListener("keydown", onKeyDown);
button.addEventListener('click', onControlButtonClick);

function onControlButtonClick() {
    if (state === GAME_STATES.initial) {
        startGame()
    } else if (state === GAME_STATES.playing) {
        pauseGame()
    } else if (state === GAME_STATES.paused) {
        resumeGame()
    }
}


function startGame() {
    draw()
    startInterval();
    state = GAME_STATES.playing;
    button.innerText = "Pause"
}

function pauseGame() {
    clearInterval(timer);
    state = GAME_STATES.paused;
    button.innerText = "Play"
}

function resumeGame() {
    startInterval();
    state = GAME_STATES.playing;
    button.innerText = "Pause"
}

function onKeyDown(e) {
    if (state !== GAME_STATES.playing) {
        return
    }
    if (e.key === "ArrowDown") {
        moveDown()
    }
    if (e.key === "ArrowRight") {

        moveRight()

    }
    if (e.key === "ArrowLeft") {

        moveLeft()

    }
    if (e.key === "ArrowUp") {
        rotate()
    }
    if (e.key === "Space")
        pauseGame()
}

function startInterval() {
    timer = setInterval(moveDown, 1000)
}

function getElementByCoord(c) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].dataset.coord == c) {
            return items[i]
        }
    }
}

function moveDown() {
    undraw()
    if (currentBlock.some(index => items[currentCoord + index + columnCount].classList.contains("taken"))) {
        draw()
        freeze()
        gameOver()
    } else {
        currentCoord += columnCount
        draw()
        removeLine()
    }

}



function moveRight() {
    undraw();
    let rightSide = currentBlock.some(index => (currentCoord + index) % columnCount === columnCount - 1)
    if (!rightSide) currentCoord += 1
    if (currentBlock.some(index => items[currentCoord + index].classList.contains("taken"))) {
        currentCoord -= 1
    }
    draw()
}

function moveLeft() {
    undraw();
    let leftSide = currentBlock.some(index => (currentCoord + index) % columnCount === 0)
    if (!leftSide) currentCoord -= 1
    if (currentBlock.some(index => items[currentCoord + index].classList.contains("taken"))) {
        currentCoord += 1
    }
    draw()
}



class Figures {
    constructor(coords) {
        this.coords = coords;
    }
    paint() {
        for (let i = 0; i < this.coords.length; i++) {
            let currentEl = getElementByCoord(this.coords[i]);
            currentEl.classList.add("active")
        }
    }
    remove() {
        for (let i = 0; i < this.coords.length; i++) {
            let currentEl = getElementByCoord(this.coords[i]);
            currentEl.classList.remove("active")
        }
    }
}


let a = new Figures([
    [0, 1, columnCount, columnCount + 1],
    [0, 1, columnCount, columnCount + 1],
    [0, 1, columnCount, columnCount + 1],
    [0, 1, columnCount, columnCount + 1]
]);
let b = new Figures([
        [0, 1, columnCount - 1, columnCount],
        [0, columnCount, columnCount + 1, columnCount + 11],
        [0, 1, columnCount - 1, columnCount],
        [0, columnCount, columnCount + 1, columnCount + 11]
    ])

let c = new Figures([
        [0, 1, columnCount + 1, columnCount + 2],
        [1, columnCount + 1, columnCount, columnCount * 2],
        [0, 1, columnCount + 1, columnCount + 2],
        [1, columnCount + 1, columnCount, columnCount * 2]
    ])

let d = new Figures([
    [1, columnCount, columnCount + 1, columnCount + 2],
    [0, columnCount, columnCount * 2, columnCount + 1],
    [0, 1, 2, columnCount + 1],
    [columnCount, columnCount + 1, 1, columnCount * 2 + 1]
])


let e = new Figures([
        [0, columnCount, columnCount * 2, columnCount * 3],
        [3, 2, 1, 0],
        [0, columnCount, columnCount * 2, columnCount * 3],
        [3, 2, 1, 0]
    ])
let f = new Figures([
        [1, columnCount + 1, columnCount * 2, columnCount + 11],
        [0, columnCount, columnCount + 1, columnCount + 2],
        [0, 1, columnCount, columnCount * 2],
        [0, 1, 2, columnCount + 2]
    ])
let j = new Figures([
        [0, columnCount, columnCount + 10, columnCount + 11],
        [0, 1, 2, columnCount],
        [0, 1, columnCount + 1, columnCount * 2 + 1],
        [columnCount, columnCount + 1, columnCount + 2, 2]
    ])
let arrOfElements = [a, b, c, d, e, f, j];
let randomElement = Math.floor(Math.random() * arrOfElements.length)
let currentBlock = arrOfElements[randomElement].coords[currentPosition]


function draw() {
    currentBlock.forEach(index => {
        items[currentCoord + index].classList.add('active');
        items[currentCoord + index].style.backgroundColor = colorArr[randomColor];
    })
}


function undraw() {
    currentBlock.forEach(index => {
        items[currentCoord + index].classList.remove('active');
        items[currentCoord + index].style.backgroundColor = ""
    })
}



function freeze() {
    if (currentBlock.some(index => items[currentCoord + index + columnCount].classList.contains("taken"))) {
        currentBlock.forEach(index => items[currentCoord + index].classList.add("taken"))
        randomElement = Math.floor(Math.random() * arrOfElements.length);
        randomColor = Math.floor(Math.random() * colorArr.length)
        currentBlock = arrOfElements[randomElement].coords[currentPosition];
        currentCoord = Math.floor(columnCount / 2 - 1);
        draw()
    }
}


function rotate() {
    undraw();
    currentPosition++
    if (currentPosition === currentBlock.length) {
        currentPosition = 0
    }
    if (currentBlock.some(index => items[currentCoord + index >= columnCount])) {
        currentCoord -= 1
    }
    currentBlock = arrOfElements[randomElement].coords[currentPosition]
    draw()
}


function taken() {
    for (let i = allCubesCount; i < allCubesCount + 10; i++) {
        document.getElementsByClassName("item")[i].classList.add('taken');
        document.getElementsByClassName("item")[i].classList.add('forFreezing');
    }
}
taken()


function removeLine() {
    for (let i = 0; i < allCubesCount; i += columnCount) {
        let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
        if (row.every(index => items[index].classList.contains("taken"))) {
            score++;
            scoreCalc.innerHTML = score;
            row.forEach(index => {
                items[index].classList.remove("active");
                items[index].classList.remove("taken")
                items[index].style.backgroundColor = ""
            })
            let removedRows = arrFromItems.splice(i, columnCount)
            arrFromItems = removedRows.concat(arrFromItems);
            arrFromItems.forEach(cell => container.appendChild(cell))
        }
    }
}


function gameOver() {
    if (currentBlock.some(index => items[currentCoord + index].classList.contains("taken"))) {
        alert('Game over\nPress "OK" to play again')
        clearInterval(timer);
        window.location.reload()
    }
}