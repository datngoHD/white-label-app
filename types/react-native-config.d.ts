declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV: string;
    APP_NAME: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
