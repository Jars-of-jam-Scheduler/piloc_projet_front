import axios from 'axios';

export default {
	setupInterceptor() {
		axios.interceptors.response.use(response => {
			return response;
		}, error => {
			const originalRequest = error.config;
			if (error.response.status === 401 && !originalRequest._retry) {
				const vm = this;

				originalRequest._retry = true;
				return axios.post('http://localhost:80/oauth/token', {
					'grant_type': 'refresh_token',
					'client_id': '10',
					'client_secret': 'JNoZHK3lUVvUd7V0xyqYyhcMmfX3hpdo9FtLIRmb',
					'refresh_token': vm.refreshToken,
					'scope': '',
				}).then(response => {
					vm.refreshToken = response.data.refresh_token;
					vm.accessToken = response.data.access_token;

					axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
					originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token;
					return axios(originalRequest);
				});
			}
			return Promise.reject(error);
		});
	}
}