<template>
  <q-page>
    <q-card class="no-padding no-shadow" style="height: 300px">
      <q-card-section class="no-padding text-right">
        <q-btn flat round :icon="matDeleteForever" size="xs" @click="clearStorage">
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-xs"
          >
            {{ $t('delete_all') }}
          </q-tooltip>
        </q-btn>
        <q-btn flat round :icon="matClose" size="xs" @click="closePage">
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-xs"
          >
            {{ $t('close_window') }}
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section class="no-padding">
        <q-scroll-area class="scroll-area">
          <!-- <q-infinite-scroll @load="onLoad" :offset="260"> -->
          <q-list>
            <q-expansion-item
              switch-toggle-side
              expand-separator
              group="histories"
              :label="v.source.slice(0, 42) + '...'"
              :caption="new Date(parseInt(k)).toLocaleString()"
              v-for="[k, v] in histories"
              :key="k"
            >
              <div class="detail-area">
                <div class="detail l-color">{{ v.source }}</div>
                <div class="detail l-color2">{{ v.translated }}</div>
                <q-badge outline rounded color="orange" :label="v.translator" />
              </div>
            </q-expansion-item>
          </q-list>
          <!-- <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll> -->
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { matClose, matDeleteForever } from '@quasar/extras/material-icons';
import {
  EVENT_STORAGE_GET,
  EVENT_SET_SIZE,
  EVENT_CLOSE_WINDOW,
  EVENT_STORAGE_CLEAR,
} from '../services/constants';

const $q = useQuasar();
const histories = ref();
const fetchTranslateResult = async () => {
  return await $q.bex.send(EVENT_STORAGE_GET, { key: null }).then(async (result) => {
    if (result?.data) return Object.entries(result?.data).reverse();
    return [];
  });
};
// const onLoad = (index, done) => {
//   setTimeout(() => {
//     histories.value += fetchTranslateResult();
//     done();
//   }, 2000);
// };
const closePage = async function () {
  await $q.bex.send(EVENT_CLOSE_WINDOW);
};
const clearStorage = async function () {
  await $q.bex.send(EVENT_STORAGE_CLEAR).then(async () => {
    histories.value = await fetchTranslateResult();
  });
};
onMounted(async () => {
  histories.value = await fetchTranslateResult();
  await $q.bex.send(EVENT_SET_SIZE, {
    height: '300px',
    width: '400px',
  });
});
</script>
<style lang="sass" scoped>
.scroll-area
  height: 275px
  padding: 0px
.detail-area
  white-space: pre-line
  padding: 6px
  text-align: right
.detail
  text-align: left
  border-width: 0px 0px 0px 3px
  border-style: solid
  border-color: #0000001f
  border-radius: 3px
.l-color
  border-left-color: #00b4ff
.l-color2
  border-left-color: #da5a20
</style>
