const { execSync } = require('child_process');

execSync('rm -rf dist');
execSync('NODE_ENV=production npm run build:prod');
execSync('npm pack');
execSync(`npm publish form-kirin-${npm_package_version}.tgz`);
