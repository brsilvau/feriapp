import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.feri.app',
  appName: 'feriapp',
  webDir: 'dist/feriapp',
  server: {
    androidScheme: 'https'
  }
};

export default config;
