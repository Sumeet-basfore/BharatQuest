package expo.modules.smsinterceptor

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony

class SmsReceiver(private val onSmsReceived: (String, String) -> Unit) : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (sms in messages) {
                val messageBody = sms.displayMessageBody
                val sender = sms.displayOriginatingAddress ?: ""
                onSmsReceived(messageBody, sender)
            }
        }
    }
}
