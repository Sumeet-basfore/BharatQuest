// Reexport the native module. On web, it will be resolved to ExpoSmsInterceptorModule.web.ts
// and on native platforms to ExpoSmsInterceptorModule.ts
export { default } from './src/ExpoSmsInterceptorModule';
export { default as ExpoSmsInterceptorView } from './src/ExpoSmsInterceptorView';
export * from  './src/ExpoSmsInterceptor.types';
