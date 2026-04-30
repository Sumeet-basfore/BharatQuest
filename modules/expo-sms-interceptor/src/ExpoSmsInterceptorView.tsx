import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSmsInterceptorViewProps } from './ExpoSmsInterceptor.types';

const NativeView: React.ComponentType<ExpoSmsInterceptorViewProps> =
  requireNativeView('ExpoSmsInterceptor');

export default function ExpoSmsInterceptorView(props: ExpoSmsInterceptorViewProps) {
  return <NativeView {...props} />;
}
