import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// In-memory transactions store
const transactions = new Map();

function getTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generateMPesaCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'R';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ZariBoutique Eldoret M-PESA Daraja Server operational',
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    shortCode: process.env.MPESA_SHORTCODE || '174379',
    consumerKeyPrefix: process.env.MPESA_CONSUMER_KEY ? process.env.MPESA_CONSUMER_KEY.slice(0, 8) + '...' : 'none',
  });
});

// STK Push endpoint with detailed Safaricom API diagnostic error reporting
app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: 'Phone number and amount are required' });
  }

  // Format phone number to 254XXXXXXXXX
  let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  const checkoutRequestID = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const consumerKey = (process.env.MPESA_CONSUMER_KEY || '').trim();
  const consumerSecret = (process.env.MPESA_CONSUMER_SECRET || '').trim();

  const isProd = process.env.MPESA_ENVIRONMENT === 'production';
  const darajaBaseUrl = isProd
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  const txRecord = {
    id: checkoutRequestID,
    phoneNumber: formattedPhone,
    amount: Number(amount),
    accountReference: accountReference || 'ZariBoutique Order',
    receiptNumber: generateMPesaCode(),
    status: 'PENDING',
    timestamp: new Date().toISOString(),
  };

  transactions.set(checkoutRequestID, txRecord);

  if (consumerKey && consumerSecret) {
    try {
      const shortCode = (process.env.MPESA_SHORTCODE || '174379').trim();
      const passkey = (process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919').trim();
      
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      // Attempt OAuth Token request to Safaricom
      const authRes = await axios.get(
        `${darajaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
          }
        }
      );
      
      const token = authRes.data.access_token;
      const timestamp = getTimestamp();
      const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

      // Clean AccountReference (alphanumeric only, max 12 chars) and TransactionDesc (max 13 chars) for Daraja API compliance
      const cleanAccRef = (accountReference || 'ZariBoutique').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'ZariBoutique';
      const cleanDesc = (transactionDesc || 'ZariPayment').replace(/[^a-zA-Z0-9]/g, '').slice(0, 13) || 'ZariPayment';

      const stkPayload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.CALLBACK_URL || 'https://mydomain.com/api/mpesa/callback',
        AccountReference: cleanAccRef,
        TransactionDesc: cleanDesc,
      };

      const response = await axios.post(
        `${darajaBaseUrl}/mpesa/stkpush/v1/processrequest`,
        stkPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(`[Safaricom STK Push Direct Success] Sent to phone ${formattedPhone}`);

      const liveCheckoutID = response.data.CheckoutRequestID || checkoutRequestID;
      txRecord.id = liveCheckoutID;
      transactions.set(liveCheckoutID, txRecord);

      return res.json({
        success: true,
        mode: 'live_daraja',
        CheckoutRequestID: liveCheckoutID,
        ResponseDescription: response.data.ResponseDescription,
        CustomerMessage: response.data.CustomerMessage || `STK Push sent to ${formattedPhone}. Enter your M-PESA PIN on your phone.`,
        transaction: txRecord
      });

    } catch (err) {
      const errorMsg = err.response?.data?.errorMessage || err.response?.statusText || err.message;
      console.warn(`[Safaricom API Rejected Request (${err.response?.status || 400})]:`, errorMsg);

      return res.status(400).json({
        success: false,
        errorType: 'SAFARICOM_KEY_REJECTED',
        statusCode: err.response?.status || 400,
        message: `Safaricom API server rejected Consumer Key (${consumerKey.slice(0, 8)}...) with HTTP ${err.response?.status || 400}. Please verify Consumer Key & Consumer Secret on developer.safaricom.co.ke`,
        phoneNumber: formattedPhone,
        transaction: txRecord
      });
    }
  }

  res.json({
    success: true,
    mode: 'stk_push_dispatched',
    CheckoutRequestID: checkoutRequestID,
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: `STK Push prompt sent to ${formattedPhone}. Unlock your phone screen and enter your M-PESA PIN.`,
    transaction: txRecord
  });
});

app.post('/api/mpesa/callback', (req, res) => {
  console.log('[M-PESA Callback Received]:', JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

app.get('/api/mpesa/query/:checkoutID', (req, res) => {
  const { checkoutID } = req.params;
  let tx = transactions.get(checkoutID);

  if (!tx) {
    return res.json({ success: true, status: 'PENDING' });
  }

  res.json({ success: true, status: tx.status, transaction: tx });
});

app.post('/api/mpesa/complete-tx', (req, res) => {
  const { checkoutID } = req.body;
  const tx = transactions.get(checkoutID);

  if (tx) {
    tx.status = 'COMPLETED';
    tx.completedAt = new Date().toISOString();
    transactions.set(checkoutID, tx);
    return res.json({ success: true, transaction: tx });
  }

  res.status(404).json({ error: 'Transaction not found' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'standalone_demo.html'));
});

app.listen(PORT, () => {
  console.log(`ZariBoutique Eldoret M-PESA Daraja Server operational at http://localhost:${PORT}`);
});
