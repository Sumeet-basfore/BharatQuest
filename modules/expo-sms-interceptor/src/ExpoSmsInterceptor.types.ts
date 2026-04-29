import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoSmsInterceptorModuleEvents = {
  onSmsReceived: (params: SmsReceivedEventPayload) => void;
};

export type SmsReceivedEventPayload = {
  messageBody: string;
  sender: string;
};

export type ExpoSmsInterceptorViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
