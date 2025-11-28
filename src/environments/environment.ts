import packageJson from '../../package.json';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  version: packageJson.version,
};
