<script setup>

const checked_list = require("@/components/CheckedList.vue");

</script>

<template>
    <span v-for="item in checked_list" :key="item.id">{{ item.name }}</span>
</template>

<style>
</style>