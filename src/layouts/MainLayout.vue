<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { provide, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { TranslationRequest } from '../services/interfaces';
import {
  EVENT_ROUTE_RESET,
  EVENT_SELECTED_TEXT,
  EVENT_WRITE_CLIPBOARD_SUCCESSED,
} from '../services/constants';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const translateSource: TranslationRequest = reactive({ source: '' });

const UUID = route.query.id;
// const ROUTE_RESET = `${UUID}.translate.page.route.reset`;
// const SELECTED_TEXT = `${UUID}.pick.tab.page.selected.text`;
// const CLIPBOARD_SUCCESSED = `${UUID}.write.data.to.clipboard.successed`;

onMounted(async () => {
  // console.log('route parameters', route.query, EVENT_SELECTED_TEXT);
  $q.dark.set('auto');
  $q.bex.on(EVENT_SELECTED_TEXT, ({ data, respond }) => {
    Object.assign(translateSource, data);
    // console.log(EVENT_SELECTED_TEXT, data, translateSource);
    respond();
  });
  $q.bex.on(EVENT_ROUTE_RESET, ({ data, respond }) => {
    // console.log(EVENT_ROUTE_RESET, event);
    router.replace({ name: 'popup', query: { id: UUID } });
    respond(data);
  });
  $q.bex.on(EVENT_WRITE_CLIPBOARD_SUCCESSED, ({ data, respond }) => {
    $q.notify({
      message: t('saved_to_clipboard'),
      position: 'center',
      timeout: 550,
      badgeStyle: { display: 'none' },
    });
    respond(data);
  });
});
/*import { ref } from 'vue';

const isIniFrame = ref(false);

function iniFrame() {
  if (window.self !== window.top) {
    isIniFrame.value = true;
  } else {
    isIniFrame.value = false;
  }
}
iniFrame();*/

onBeforeUnmount(() => {
  $q.bex.off(EVENT_SELECTED_TEXT, (payload) => {
    console.log(`${EVENT_SELECTED_TEXT} event unregistered.`, payload);
  });
  $q.bex.off(EVENT_ROUTE_RESET, (payload) => {
    console.log(`${EVENT_ROUTE_RESET} event unregistered.`, payload);
  });
  $q.bex.off(EVENT_WRITE_CLIPBOARD_SUCCESSED, (payload) => {
    console.log(`${EVENT_WRITE_CLIPBOARD_SUCCESSED} event unregistered.`, payload);
  });
});

// console.log('this router is:', router);
provide('translateSource', translateSource);
provide('UUID', UUID);
</script>
<style>
body {
  overflow: hidden;
}
</style>
