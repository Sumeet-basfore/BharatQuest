import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSmsInterceptorModuleEvents } from './ExpoSmsInterceptor.types';

declare class ExpoSmsInterceptorModule extends NativeModule<ExpoSmsInterceptorModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// Fallback mock for Expo Go where the native module isn't available
let moduleInstance: ExpoSmsInterceptorModule;
try {
  moduleInstance = requireNativeModule<ExpoSmsInterceptorModule>('ExpoSmsInterceptor');
} catch (e) {
  console.warn("ExpoSmsInterceptor native module not found. Using mock implementation for Expo Go.");
  moduleInstance = {
    addListener: () => ({ remove: () => {} }),
    removeListeners: () => {},
    hello: () => "Mock Hello",
    setValueAsync: async () => {},
    PI: 3.14,
  } as any;
}

export default moduleInstance;
