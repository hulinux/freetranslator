<template>
  <q-page>
    <q-card class="card">
      <q-card-section class="no-padding align-end">
        <!-- <q-btn flat round :icon="matCompareArrows" size="xs">
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-xs"
          >
            交换翻译</q-tooltip
          >
        </q-btn> -->
        <!--{{ $t('success') }}TODO: shared.esm-bundler.js:54 [intlify] The message format compilation is not supported in this build. Because message compiler isn't included. You need to pre-compilation all message format. -->
        <!-- need data file in src/i18n,format must be json/yaml -->
        <q-btn flat round :icon="matFileCopy" size="xs" @click="copyToClipboard">
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-xs"
          >
            {{ $t('copy_translation') }}</q-tooltip
          >
        </q-btn>
        <q-btn flat round :icon="matClose" size="xs" @click="closePage">
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-xs"
          >
            {{ $t('close_window') }}</q-tooltip
          >
        </q-btn>
        <!-- <div class="text-area">by John Doe</div> -->
      </q-card-section>
      <q-separator />
      <q-card-section class="no-padding">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div class="text-area">
            <q-scroll-area class="card-12">
              <div
                class="card-12 tip-center"
                v-show="result.data?.errors && result.status"
              >
                <q-btn
                  icon="refresh"
                  size="xl"
                  flat
                  round
                  @click="fetchTranslateResult"
                />
                <p class="center">
                  {{ $t('translate_errors') }}<br />({{ $t('words_limit') }})
                </p>
              </div>
              <div v-show="result.data?.translated" style="white-space: pre-line">
                {{ result.data?.translated }}
              </div>
              <span v-show="result.data?.translator">
                [{{ result.data?.translator }}]
              </span>
            </q-scroll-area>
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading :showing="!result.status">
        <q-spinner-grid size="50px" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { inject, onMounted, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { TranslationRequest, Translation } from '../services/interfaces';
import { matFileCopy, matCompareArrows, matClose } from '@quasar/extras/material-icons';

const $q = useQuasar();

const result = reactive<{ status?: string; data?: Translation | object }>({});
const translateSource = inject<TranslationRequest>('translateSource');
const [winWidth, winHeight] = [ref('270px'), ref('220px')];
// console.log('translate data:', translateSource);

const closePage = async function () {
  await $q.bex.send('close.iframe.window');
};
const copyToClipboard = async function () {
  await $q.bex
    .send('copy.result.to.clipboard', { text: result?.data?.translated })
    .then((data) => {
      console.log('copy.result.to.clipboard happend.', data);
    });
};

const fetchTranslateResult = async function () {
  result.status = '';
  await api
    .post(
      // 'https://dev.wjmdbetc.cn/flows/trigger/4b1d74bf-ec71-4527-b9be-cda6c1f8cf10',
      'https://lci8gq9r.directus.app/flows/trigger/84b3c03c-93a4-4620-8931-5b750e420810',
      {
        source: translateSource?.source, //.replace(/[\r\n]/g, '\\n'),
        from_lang: translateSource?.from_lang || 'auto',
        to_lang: translateSource?.to_lang || navigator.language, //.split('-')[0], //取前两位扩大翻译器选择范围
        // translator: translateSource?.translator || 'baidu',
      }
    )
    .then((res) => {
      Object.assign(result, res.data);
      // console.log('axios get result is:', res);
    })
    .catch((err) => {
      Object.assign(result, err.response);
      // console.log(err, result);
    });
};
onMounted(async () => {
  // console.log('btn info:', btn.value.$el.getBoundingClientRect());
  await $q.bex.send('set.iframe.window.size', {
    height: winHeight.value,
    width: winWidth.value,
  });
  await fetchTranslateResult();
});
</script>
<style lang="sass" scoped>
.card
  width: v-bind(winWidth)
  height: v-bind(winHeight)
.card-12
  height: 186px
.text-area
  padding: 6px 2px 6px 6px
  font-size: 12px
.align-end
  display: flex
  justify-content: flex-end
.tip-center
  text-align: center
  display: flex
  flex-direction: column
  align-items: center
  justify-content: space-evenly
</style>
