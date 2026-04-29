import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoSmsInterceptor.types';

type ExpoSmsInterceptorModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoSmsInterceptorModule extends NativeModule<ExpoSmsInterceptorModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoSmsInterceptorModule, 'ExpoSmsInterceptorModule');
