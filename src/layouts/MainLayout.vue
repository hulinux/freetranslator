<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { provide, reactive, onBeforeUnmount } from 'vue';
import { useRouter /*, useRoute*/ } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { TranslationRequest } from '../services/interfaces';

const $q = useQuasar();
const router = useRouter();
const { t } = useI18n();

const translateSource: TranslationRequest = reactive({ source: '' });

$q.dark.set('auto');
$q.bex.on('pick.tab.page.selected.text', ({ data, respond }) => {
  Object.assign(translateSource, data);
  // console.log('pick.tab.page.selected.text', data, translateSource);
  respond();
});
$q.bex.on('translate.page.route.reset', () => {
  // console.log('translate.page.route.reset', event);
  router.replace({ name: 'popup' });
});
$q.bex.on('write.data.to.clipboard.successed', ({ data, respond }) => {
  $q.notify({
    message: t('saved_to_clipboard'),
    position: 'center',
    timeout: 750,
    badgeStyle: { display: 'none' },
  });
  respond(data);
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
  $q.bex.off('pick.tab.page.selected.text', (payload) => {
    console.log('pick.tab.page.selected.text event unregistered.', payload);
  });
});

console.log('this router is:', router);
provide('translateSource', translateSource);
</script>
<style>
body {
  overflow: hidden;
}
</style>
