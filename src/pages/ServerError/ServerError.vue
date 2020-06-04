<template>
  <div class="servererror-page">
        <BasicException />
      </div>
</template>

<script>
import BasicException from './components/BasicException';

export default {
  name: 'ServerError',
  components: {
    BasicException,
  },
};
</script>
<style lang="scss">
.servererror-page{
  height: 100vh;
}
.error404-page{
  height: 100%;
  background: #fff;
}
</style>
