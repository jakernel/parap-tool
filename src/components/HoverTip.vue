<script setup>

</script>

<template>
  <div class="hover-container">
    <slot></slot>
    <div class="hover-text">
      <slot name="tip"></slot>
    </div>
  </div>

</template>

<style scoped>
.hover-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.hover-container .hover-text {
  text-align: left;
  visibility: hidden;
  width: 400px;
  background-color: var(--c-bg-soft);
  color: var(--c-text);
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  left: 0;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.hover-container:hover .hover-text {
  visibility: visible;
  opacity: 1;
}
</style>