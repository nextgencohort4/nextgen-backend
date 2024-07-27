const Econsole = require("./econsole-log")
const axios = require('axios');

const {
  PAYSTACK_SECRET_KEY,
} = process.env;

// Initialize Paystack instance
const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});
exports.paymentIntialization = async (req,res) => {
  const myconsole = new Econsole("payment-paystack.js", "paymentIntialization", "")
  myconsole.log("entry")
  try {
    const amount=Number(req.amount)*Number(req.smallestUnitCurrency)
    const email = req.email
    const callback_url = req.redirect_url.
    replace("amount="+req.amount, "amount="+amount);
    const response = await paystack.post('/transaction/initialize', {
      email,
      amount,
      callback_url
    });
    myconsole.log("exits")
    return response.data;
  } catch (error) {
    myconsole.log("error=",error.message)
  }
};

exports.verifyPayment = async (req,res,next) => {
  const myconsole = new Econsole("payment-paystack.js", "verifyPayment", "")
  myconsole.log("entry")
  try {
    const { reference } = req.query;
    const response = await paystack.get(`/transaction/verify/${reference}`);

    if (
      response.data.data?.status === "success" &&
      parseInt(response.data.data?.amount) === parseInt(req.query.amount) &&
      response.data.data?.currency === req.query.currency
    ) {
      // Success! Confirm the customer's payment
      req.query.status = response.data.data.status
      myconsole.log("exits")
      next()
    } else {
      // Inform the customer their payment was unsuccessful
      res.status(404).json({
        message: "payment unsuccessful",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getPaymentDetails = async (req,res,next) => {
  const myconsole = new Econsole("payment-paystack.js", "getPaymentDetails", "")
  const { reference } = req.query;
  const response = await paystack.get(`/transaction/verify/${reference}`);
  try {

    const transaction = response.data.data;

    if (transaction) {
      req.query.paymentMethod = transaction.authorization.channel;
      myconsole.log("exits")
      next();
    } else {
      myconsole.log('Transaction not found');
      res.status(404).json({
        message: "Transaction not found",
      });
    }
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(404).json({
      message: `Error fetching transaction details:, ${error}`
    });
  }
};