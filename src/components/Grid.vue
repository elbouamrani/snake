<template>
    <div class="grid">
        <div class="row" v-for="(row, jndex) in grid" :key="jndex">
            <Cell v-for="(cell, index) in row" :key="index" :status="cell" />
        </div>
    </div>
</template>

<script>
import Cell from "./Cell";
export default {
    name: "Grid",
    props: ["grid"],
    components: {
        Cell,
    },
};
</script>

<style>
.grid {
    display: inline-block;
    border: 3pt solid black;
}

.row {
    display: flex;
}
</style>
