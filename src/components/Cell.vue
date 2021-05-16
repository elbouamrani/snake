<template>
    <div class="cell" :style="style"></div>
</template>

<script>
const VALUE_COLOR = ["white", "purple", "gray", "red"];

export default {
    name: "Cell",
    props: ["status"],
    computed: {
        style() {
            return { backgroundColor: VALUE_COLOR[this.status] };
        },
    },
};
</script>

<style>
.cell {
    --cell-size: 10pt;
    width: var(--cell-size);
    height: var(--cell-size);
    border: 1pt solid black;
    box-sizing: border-box;
}
</style>