
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SPREADSHEET_ID = "1WodDRtQwMEN95KWlD7QfiojcsMebTFl0Q2_T2eiMGko";

const GOOGLE_APPLICATION_CREDENTIALS = "./whatsappbot-389607-3340ec02504e.json";
const MESSAGE = `Dear students 📣,
    We at PLP are excited to announce 🎉 that we will be conducting guidance sessions 🤝 to help you with your projects,
    starting from Monday,12 th June!
    But remember,if you already have a solid idea💡 or an ongoing project, feel free to submit it.
    Please share your creative ideas or GitHub URL 🌐 for your projects using the Google Form below.
    Seize this chance to display your talents🚀 and learn from the experience.😊 🔗
    Google Form : https : // forms.gle/id59k8wQNESFKqsV7

    Looking forward to your submissions !`;


(async () => {
    const auth = new google.auth.GoogleAuth({keyFile: GOOGLE_APPLICATION_CREDENTIALS, scopes: ['https://www.googleapis.com/auth/spreadsheets']});

    const sheets = google.sheets({version: 'v4', auth: await auth.getClient()});

    // Fetch the data from the first 253 rows in column D
    const response = await sheets.spreadsheets.values.get({spreadsheetId: SPREADSHEET_ID, range: 'Sheet1!D1:D253'});

    const waURLs = response.data.values.map((value) => value[0]);

    const client = new Client();
    client.on('qr', (qr) => {
        console.log("Scan the following QR code to log into whatsapp web");
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
        console.log('Client is ready!');

        for (const waURL of waURLs) {
const phoneNumber = waURL.replace(/^https:\/\/wa\.me\//, '').replace(/^(\+|0)/, '') + '@c.us';

            try {
                const contact = await client.getContactById(phoneNumber);
                const sentMsg = await client.sendMessage(phoneNumber, MESSAGE);
                console.log(`Message sent to ${phoneNumber}:`, sentMsg.id.id);
            } catch (error) {
                console.error(`Failed to send message to ${phoneNumber}:`, error.message);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000)); // Provide a delay of 2 seconds (2000 milliseconds) between messages
        }client.destroy();
    });

    client.initialize();
})();
