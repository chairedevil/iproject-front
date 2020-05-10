<template>
  <v-app>
    <Header />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Header from '@/components/Header/Header'

export default {
  name: 'App',
  components: {
    Header
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss" scoped>

</style>