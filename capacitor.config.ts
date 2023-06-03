import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hackdiary.luti',
  appName: 'luti',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
