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

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const translateSource: TranslationRequest = reactive({ source: '' });

const UUID = route.query.id;
const ROUTE_RESET = `${UUID}.translate.page.route.reset`;
const SELECTED_TEXT = `${UUID}.pick.tab.page.selected.text`;
const CLIPBOARD_SUCCESSED = `${UUID}.write.data.to.clipboard.successed`;

onMounted(async () => {
  // console.log('route parameters', route.query);
  $q.dark.set('auto');
  $q.bex.on(SELECTED_TEXT, ({ data, respond }) => {
    Object.assign(translateSource, data);
    // console.log(SELECTED_TEXT, data, translateSource);
    respond();
  });
  $q.bex.on(ROUTE_RESET, ({ data, respond }) => {
    // console.log(ROUTE_RESET, event);
    router.replace({ name: 'popup', query: { id: UUID } });
    respond(data);
  });
  $q.bex.on(CLIPBOARD_SUCCESSED, ({ data, respond }) => {
    $q.notify({
      message: t('saved_to_clipboard'),
      position: 'center',
      timeout: 750,
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
  $q.bex.off(SELECTED_TEXT, (payload) => {
    console.log(`${SELECTED_TEXT} event unregistered.`, payload);
  });
  $q.bex.off(ROUTE_RESET, (payload) => {
    console.log(`${ROUTE_RESET} event unregistered.`, payload);
  });
  $q.bex.off(CLIPBOARD_SUCCESSED, (payload) => {
    console.log(`${CLIPBOARD_SUCCESSED} event unregistered.`, payload);
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
