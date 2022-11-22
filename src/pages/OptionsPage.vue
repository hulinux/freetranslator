<template>
  <q-page>
    <!-- content -->
    <q-card>
      <q-card-section class="about-font">
        {{ $t('about_this_extension') }}
      </q-card-section>
      <q-card-actions align="right" class="no-padding">
        <a
          href="https://github.com/hulinux/freetranslator/issues/new"
          target="_blank"
          style="text-decoration: none; padding: 4px"
        >
          <q-badge
            :label="$t('feedback_questions')"
            outline
            rounded
            color="primary"
            size="xs"
          />
        </a>
        <a
          href="https://github.com/hulinux/freetranslator/discussions/new"
          target="_blank"
          style="text-decoration: none; padding: 4px"
        >
          <q-badge
            :label="$t('make_suggestions')"
            outline
            rounded
            color="primary"
            size="xs"
          />
        </a>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
<style lang="sass" scoped>
.about-font
  font-size: 11px
  width: 260px
</style>
