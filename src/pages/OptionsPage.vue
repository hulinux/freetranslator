<template>
  <q-page>
    <!-- content -->
    <q-card>
      <q-card-section class="about-font">
        {{ $t('about_this_extension') }}
        <!-- https://github.com/hulinux/freetranslator/issues/new -->
        <!-- https://github.com/hulinux/freetranslator/discussions/new -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
<style lang="sass" scoped>
.about-font
  font-size: 11px
  width: 260px
</style>
