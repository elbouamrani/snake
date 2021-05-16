<template>
    <div id="app">
        <div class="actions-container">
            <div>score: {{ body.length }}</div>
            &nbsp;|&nbsp;
            <div>
                <button @click="resetGame">replay</button>
            </div>
            &nbsp;|&nbsp;
            <div>
                <button @click="togglePlay">
                    {{ running ? "pause" : "play" }}
                </button>
            </div>
        </div>
        <div class="grid-container" v-if="grid">
            <Grid :grid="paintedGrid" />
        </div>
        <div class="leader-board-container">
            <h4>Leaderboard</h4>
            <table>
                <tr v-for="(item, key) in sortedLeaderBoard" :key="key">
                    <td>{{ item }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import SnakeService from "./services/SnakeService";

import Grid from "./components/Grid.vue";

// eslint-disable-next-line no-unused-vars
const DIRECTIONS = {
    up: [-1, 0],
    down: [1, 0],
    right: [0, 1],
    left: [0, -1],
};

const DEFAULT_SPEED = 400;

export default {
    name: "App",
    components: {
        Grid,
    },
    data() {
        return {
            height: 20,
            width: 20,

            grid: null,
            position: [0, 0],
            body: [],

            direction: "right",

            ticker: null,
            tickerSpeed: 400,
            difficultyGauge: 1.1,

            running: true,

            leaderBoard: [],
        };
    },
    computed: {
        paintedGrid() {
            const grid = JSON.parse(JSON.stringify(this.grid));
            grid[this.position[0]][this.position[1]] = 1;
            this.body.map((section) => {
                grid[section.y][section.x] = 2;
            });
            // console.log(this.body);
            // console.log(this.grid);
            // console.log(grid);
            return grid;
        },
        sortedLeaderBoard() {
            return [...this.leaderBoard].sort();
        },
    },
    methods: {
        initGrid() {
            this.grid = SnakeService.generateGrid(this.height, this.width);
            this.grid = SnakeService.generateFood(this.grid);
            this.position = this.calcCenterPosition();
        },
        calcCenterPosition() {
            return [Math.round(this.height / 2), Math.round(this.width / 2)];
        },
        moveHead(direction) {
            const result = SnakeService.moveHead(
                this.grid,
                this.position,
                direction,
                this.body
            );
            if (result) {
                if (result.status === "gain") {
                    this.grid = result.grid;
                    this.body = result.body;
                    this.position = result.position;

                    const speed = this.tickerSpeed / this.difficultyGauge;
                    this.tickerSpeed = speed > 100 ? speed : 100;

                    this.setupTicker(this.tickerSpeed);
                } else if (result.status === "move") {
                    this.body = result.body;
                    this.position = result.position;
                }
            } else {
                this.running = false;
                this.leaderBoard.push(this.body.length);
                alert("game over! score: " + this.body.length);
                this.resetGame();
            }
        },
        updateCycle() {
            // console.log("update cycle");
            this.moveHead(DIRECTIONS[this.direction]);
        },
        togglePlay() {
            this.running = !this.running;
        },
        setDirection(direction) {
            this.direction = direction;
        },
        registerControlKeys() {
            window.addEventListener("keydown", (e) => {
                switch (e.code) {
                    case "ArrowDown":
                        this.setDirection("down");
                        break;
                    case "ArrowUp":
                        this.setDirection("up");
                        break;
                    case "ArrowRight":
                        this.setDirection("right");
                        break;
                    case "ArrowLeft":
                        this.setDirection("left");
                        break;
                    case "Space":
                        this.togglePlay();
                        break;
                }
            });
        },
        setupTicker() {
            clearInterval(this.ticker);
            this.ticker = setInterval(() => {
                if (this.running) {
                    this.updateCycle();
                }
            }, this.tickerSpeed);
            // console.log(this.tickerSpeed);
        },
        resetGame() {
            this.body = [];
            this.initGrid();
            this.tickerSpeed = DEFAULT_SPEED;
            this.setupTicker(DEFAULT_SPEED);
        },
    },
    mounted() {
        this.initGrid();
        this.registerControlKeys();
        this.setupTicker(DEFAULT_SPEED);
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.actions-container {
    display: flex;
    justify-content: center;
    margin-bottom: 10pt;
}
.actions-container > div {
    margin: 0pt 5pt;
}

table {
    width: 100%;
    border: 1pt solid;
}

tr:nth-child(2n + 1) {
    background-color: lightgoldenrodyellow;
}
</style>
