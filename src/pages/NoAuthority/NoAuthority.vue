<template>
  <div class="noauthority-page">
        <NotPermission />
      </div>
</template>

<script>
import NotPermission from './components/NotPermission';

export default {
  name: 'NoAuthority',
  components: {
    NotPermission,
  },
};
</script>
<style scoped>
.noauthority-page{
  height: calc(100vh - 65px);
  background: #fff;
}
</style>
