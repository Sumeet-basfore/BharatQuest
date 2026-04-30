// Web fallback — SMS interception is Android-only.
// This module is a no-op safe stub to prevent crashes on web.
import { registerWebModule, NativeModule } from 'expo';

import { ExpoSmsInterceptorModuleEvents } from './ExpoSmsInterceptor.types';

class ExpoSmsInterceptorModule extends NativeModule<ExpoSmsInterceptorModuleEvents> {
  // No-op stubs for web compatibility
}

export default registerWebModule(ExpoSmsInterceptorModule, 'ExpoSmsInterceptorModule');
