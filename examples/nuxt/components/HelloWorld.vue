<script setup lang="ts">
import { externalStyle } from './HelloWorld.vue.css'
</script>

<template>
  <h1 :class="externalStyle">using class binding</h1>
  <span class="inlineStyle">using actual class</span>
</template>

<style scoped>
.inlineStyle {
  font-weight: bold;
}
</style>
