<template>
  <div>
    <h1>hello world！世界，你好。</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log(123);
    });
  },
});
</script>
