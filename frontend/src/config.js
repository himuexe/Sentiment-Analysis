const config = {
  development: {
    apiUrl: 'http://localhost:3002'
  },
  production: {
    apiUrl: 'https://sentiment-analysis-t7kx.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_URL = config[environment].apiUrl; 