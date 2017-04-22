<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import indexPage from '@/components/index-page/index-page'
  import store from '@/store'
  export default {
    name: 'app',
    components: {
      'index-page': indexPage
    },
    store
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    cursor default
</style>
