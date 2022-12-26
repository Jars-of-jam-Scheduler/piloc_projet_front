<script>
import axios from 'axios'
import qs from 'qs';

export default {
	data() {
		return {
			button_oauth_url: qs.stringify({
									client_id: 10,
									redirect_uri: 'http://localhost:5174/auth/callback',
									response_type: 'code',
									scope: '',
									prompt: 'login'
								}, { encode: true }),

			state: 'jnmcjhrplssmnfjvkfrswydxzzxvvcwlnkweyzaz'
		}
	},

	props: [
		'accessToken'
	],

	emits: [
		'gotRefreshToken',
		'gotAccessToken'
	],

	created() {
		//this.state = random40chars

		if (window.location.href.startsWith("http://localhost:5174/auth/callback")) {
			this.handleOAuthURL();
		}
	},

	methods: {
		async handleOAuthURL() {
			const params = new URLSearchParams(window.location.href.split('?')[1]);
			const request_state = params.get('state')
			console.log(this.state)
			console.log(request_state)
			if(request_state != this.state) {
				throw new Error('States mismatch')
			}

			const code = params.get('code');

			try {
				const response = await axios.post('http://localhost:80/oauth/token', {
					'grant_type': 'authorization_code',
					'client_id': '10',
					'client_secret': 'JNoZHK3lUVvUd7V0xyqYyhcMmfX3hpdo9FtLIRmb',
					'redirect_uri': 'http://localhost:5174/auth/callback',
					'code': code,
				});
				console.log(response.data);

				const refresh_token = response.data.refresh_token;
				this.$emit('gotRefreshToken', { 'data': refresh_token })
				const access_token = response.data.access_token;
				this.$emit('gotAccessToken', { 'data': access_token })

			} catch (error) {
				console.error(error);
			}
		},

		async callApiHello() {
			try {
				console.log('callapihello', this.accessToken);

				const response = await axios.get('http://localhost:80/api/hello', {
					headers: {
						'Authorization': 'Bearer ' + this.accessToken
					}
				});
			} catch (error) {
				console.error(error);
			}
		},
	}
}
</script>

<template>
	<div>
		<a :href="`http://localhost:80/oauth/authorize?${button_oauth_url}&state=${state}`" rel="noopener noreferrer">Connect with OAuth</a>
		<button @v-if="" @click="callApiHello">Call API</button>
	</div>
</template>