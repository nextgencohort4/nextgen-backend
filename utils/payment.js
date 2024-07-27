const Flutterwave = require("flutterwave-node-v3");
const Econsole = require("./econsole-log")
const {
  FLW_SECRET_KEY,
  FLW_PUBLIC_KEY,
  FLW_URL,
} = process.env;
exports.paymentIntialization = async (req) => {
  const myconsole = new Econsole("payment.js", "paymentIntialization", "")
  myconsole.log("entry")
  myconsole.log(req);
  const response = (async () => {
  try {
    const { default: got } = await import('got');
    const response = await got
      .post(`${FLW_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
        json: {
          tx_ref: req.uuid,
          redirect_url: req.redirect_url,
          meta: {
            consumer_id: req.userId,
            consumer_mac: req.mac,
          },
          customer: {
            email: req.email,
            phonenumber: req.phoneNumber,
            name: req.name,
          },
          customizations: {
            title: PAYMENT_CUSTOMER_TITLE,
            // logo: PAYMENT_CUSTOMER_LOGO,
          },
        },
      })
      .json();
    myconsole.log("response=",response);
    myconsole.log("exits")
    return response;
  } catch (err) {
    myconsole.log("err.code=",err.code);
    myconsole.log("err.response.body",err.response.body);
    return err
  }
})();
return response;
};

exports.verifyPayment = async (req,res,next) => {
  const myconsole = new Econsole("payment.js", "verifyPayment", "")
  myconsole.log("entry")
  const flw = new Flutterwave(FLW_PUBLIC_KEY,FLW_SECRET_KEY);
  flw.Transaction.verify({ id: req.query.transaction_id })
    .then((response) => {
      if (
        response.data?.status === "successful" &&
        parseInt(response.data?.amount) === parseInt(req.query.amount) &&
        response.data?.currency === req.query.currency
      ) {
        // Success! Confirm the customer's payment
        next()
      } else {
        // Inform the customer their payment was unsuccessful
        res.status(404).json({
          message: "payment unsuccessful",
        });
      }
      myconsole.log("exits")
    })
    .catch((err)=>console.log(err));
};
exports.getPaymentDetails = async (req,res,next) => {
  const url = `${FLW_URL}/transactions/${req.query.transaction_id}/verify`;
  try {
    const { default: got } = await import('got');
    const response = await got(url, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
      responseType: 'json',
    });

    const transaction = response.body.data;

    if (transaction) {
      console.log('Transaction Details:', transaction);
      console.log('Payment Method:', transaction.payment_type);
      req.query.paymentMethod = transaction.payment_type;
      next();
    } else {
      console.log('Transaction not found');
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