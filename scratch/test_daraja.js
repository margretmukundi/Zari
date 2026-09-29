import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testWithHeaders() {
  const consumerKey = (process.env.MPESA_CONSUMER_KEY || '').trim();
  const consumerSecret = (process.env.MPESA_CONSUMER_SECRET || '').trim();
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  console.log('Testing Consumer Key:', consumerKey);
  console.log('Consumer Secret:', consumerSecret);

  try {
    const res = await axios({
      method: 'get',
      url: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'NodeJS/DarajaClient'
      }
    });
    console.log('✅ Daraja OAuth Success! Token:', res.data);
  } catch (err) {
    console.log('Response status:', err.response?.status);
    console.log('Response headers:', err.response?.headers);
    console.log('Response data:', err.response?.data);
  }
}

testWithHeaders();
