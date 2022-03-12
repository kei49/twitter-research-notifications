start:
	pm2 start ./src/index.ts --name twitter-research-notifications
restart:
	pm2 restart ./src/index.ts --name twitter-research-notifications
