const axios = require("axios");

const baseURL = 'http://127.0.0.1:8080';
const acc = process.argv[2];
const depth = process.argv[3];

(async function () {
  try {
    const url = `${baseURL}/accounts/${acc}/staking-payouts?depth=${depth}&unclaimedOnly=true`;
    console.log("requesting pending payouts...");  

    const { data } = await axios.get(url);
    var total = 0;

    for (let {payouts} of data.erasPayouts) {
        for (let {nominatorStakingPayout} of payouts) {
            total = total + Number(nominatorStakingPayout);
        }
    }

    console.log("account_id:", acc);
    console.log("depth:", depth);
    console.log("pending payouts (Planck):", total);
    console.log("pending payouts (KSM):", total / Math.pow(10, 12));
  } catch (err) {
    console.log('error:', err);
  }
})();