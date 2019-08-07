<template>
  <div id="app">

    <transition name="fade">
      <overlay v-if="showOverlay"/>
    </transition>

    <transition name="zoom">
      <router-view/>
    </transition>

  </div>
</template>

<script>


import overlay from '@/components/Groups'

export default {
  name: 'app',
  data(){
    return {}
  },
  computed: {
    showOverlay(){ 
      return this.$store.state.showGroups;
    }
  },
  components: {
    overlay
  }
}
</script>

<style>
body, html {
    margin: 0;
    width: 100vw;
    height: 100vh;
}

#app {
    margin: 0;
    font-family: 'Fira Sans';
    font-weight: 400;
    font-style: normal;
    font-size: .9em;
    background: #A66FC7;
    overflow-x: hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    position: absolute;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: all .2s;
}

.zoom-enter, .zoom-leave-to {
  opacity: 0;
  transform: scale3d(1.4,1.4,0);
}

</style>
