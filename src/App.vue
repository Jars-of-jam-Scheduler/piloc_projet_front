<script>
import HelloWorld from './components/HelloWorld.vue'
import MyOAuth from './components/MyOAuth.vue'
import authService from './authService';

export default {
	data() {
		return {
			refreshToken: null,
			accessToken: null
		}
	},

	methods: {
		setRefreshToken(refresh_token) {
			this.refreshToken = refresh_token.data
		},
		setAccessToken(access_token) {
			this.accessToken = access_token.data
			console.log('setAccessToken', this.accessToken)
		},
	},
	
	components: {
		MyOAuth,
		HelloWorld
	},

	created() {
		authService.setupInterceptor.bind(this)();
	}
}


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <MyOAuth :accessToken="accessToken" @gotRefreshToken="setRefreshToken" @gotAccessToken="setAccessToken"/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
