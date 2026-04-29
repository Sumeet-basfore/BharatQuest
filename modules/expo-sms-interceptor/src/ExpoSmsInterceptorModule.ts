import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSmsInterceptorModuleEvents } from './ExpoSmsInterceptor.types';

declare class ExpoSmsInterceptorModule extends NativeModule<ExpoSmsInterceptorModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSmsInterceptorModule>('ExpoSmsInterceptor');
