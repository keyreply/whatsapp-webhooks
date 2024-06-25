export async function handleNewMessages(wabId, payload) {
  try {
    const phoneNumberId =
      payload?.whatsapp_business_api_data?.phone_number_id ||
      payload.metadata.phone_number_id;

    const keyreply_webhook_url = "";
    const messages = payload.messages || payload.statuses;
    if (!messages) return;
    await axios.post(keyreply_webhook_url, messages);
    this.logger.log(`Send message to Webhook URL: ${webhookUrl} `);
  } catch (error) {
    this.logger.error(error.message);
    return;
  }
}