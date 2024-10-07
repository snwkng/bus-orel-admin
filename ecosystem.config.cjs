module.exports = {
	apps: [
		{
			name: 'bus-orel-admin',
			port: '5173',
			exec_mode: 'cluster',
			instances: 'max',
			script: './dist/index.html'
		}
	]
}
