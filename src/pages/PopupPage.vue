<template>
  <q-page>
    <q-btn
      icon="translate"
      size="sm"
      :to="{ name: 'index' }"
      :replace="true"
      color="primary"
      style="padding: 2px"
    />
    <!-- <router-link :to="{ name: 'options' }"></router-link> -->
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { EVENT_SET_SIZE } from '../services/constants';
const $q = useQuasar();
// const UUID = inject<string>('UUID');
// const SET_SIZE = `${UUID}.set.iframe.window.size`;
// const translateSource = inject('translateSource');

// const clickHandler = function (e: Event, go) {
//   e.preventDefault();
//   if (translateSource) go();
// };
onMounted(async () => {
  // console.log('btn info:', btn.value.$el.getBoundingClientRect());
  await $q.bex.send(EVENT_SET_SIZE, {
    height: '26px',
    width: '21px',
  });
});
</script>
