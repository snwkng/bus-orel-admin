module.exports = {
	apps: [
		{
			name: 'bus-orel-admin',
			port: '5174',
			exec_mode: 'cluster',
			instances: 'max',
			script: './dist/index.html'
		}
	]
}
