<template>
  <div class="login-page">
        <UserLogin />
        <!-- <UserLogin1 /> -->
      </div>
</template>

<script>
import UserLogin from './UserLogin';

export default {
  name: 'Login',
  components: {
    UserLogin,
  }
};
</script>
