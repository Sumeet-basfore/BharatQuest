import * as React from 'react';

import { ExpoSmsInterceptorViewProps } from './ExpoSmsInterceptor.types';

export default function ExpoSmsInterceptorView(props: ExpoSmsInterceptorViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
