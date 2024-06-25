const { handleNewMessages } = require('./service');

const app = require('express')();

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/webhooks', (req, res) => {
  try {
    const mode = req.query["hub.mode"]
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    if (
      mode && token &&
      mode == 'subscribe' &&
      token == process.env.Meta_WA_VerifyToken
    )
      return res.status(200).send(challenge);
    else
      return res.sendStatus(403);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
})

app.post('/webhooks', async (req, res) => {
  try {
    const data = req.body;
    if (data.object) {
      const entries = data.entry;
      for (const entry of entries) {
        const { id: wabaId, changes } = entry;
        for (const change of changes) {
          const { field, value } = change;
          switch (field) {
            case 'phone_number_quality_update':
              // await handlePhoneNumberQualityUpdate(value);
              break;
            case 'phone_number_name_update':
              // await handlePhoneNumberNameUpdate(wabaId);
              break;
            case 'account_review_update':
            case 'account_update':
              // await handleAccountStatusUpdate(wabaId);
              break;
            case 'messages':
             await handleNewMessages(wabaId, value);
            default:
              break;
          }
        }
      }
      res.status(200).send();
    }
  } catch (error) {
    res.status(500).send();
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})