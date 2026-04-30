package expo.modules.smsinterceptor

import android.content.IntentFilter
import android.provider.Telephony
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSmsInterceptorModule : Module() {
  private var smsReceiver: SmsReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoSmsInterceptor")

    Events("onSmsReceived")

    OnCreate {
      val context = appContext.reactContext ?: return@OnCreate
      smsReceiver = SmsReceiver { messageBody, sender ->
        sendEvent("onSmsReceived", mapOf(
          "messageBody" to messageBody,
          "sender" to sender
        ))
      }
      val filter = IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
        context.registerReceiver(smsReceiver, filter, android.content.Context.RECEIVER_EXPORTED)
      } else {
        context.registerReceiver(smsReceiver, filter)
      }
    }

    OnDestroy {
      val context = appContext.reactContext ?: return@OnDestroy
      smsReceiver?.let {
        context.unregisterReceiver(it)
      }
    }
  }
}
