<script setup>
// prop
import {computed, defineProps} from 'vue'
import {marked} from "marked";
const props = defineProps({
  mdContent: String
})
const compiledMarkdown = computed(() => {
  return marked(props.mdContent)}  )// marked is a global variable


</script>

<template>
  <div v-html="compiledMarkdown" class="mdui-prose"></div>
</template>

<style scoped>

</style>