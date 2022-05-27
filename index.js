const fs = require("fs");
const path = require("path");
const express = require("express");
const objArrayPayout = require("./payouts.json");

const app = express();
const port = 3000;

app.use(express.json());

// PEGA TODOS ELEMENTOs do ARRAY
app.get("/payouts", (req, res) => res.json(objArrayPayout));

// PEGA UM ELEMENTO do ARRAY
app.get("/payouts/:crash", (req, res) => {
    const { crash } = req.params; // params, ou seja, o envio ta sendo feito pela URL
    const finded = objArrayPayout.find((element) => element.crash === parseFloat(crash));

    if (finded) return res.json(finded);

    return res.json({ message: `Esse crash ${crash} ainda não existe` });
});

// ADD UM ELEMENTO ao ARRAY
app.post("/payouts", (req, res) => {
    //const { crash, round_max, chance } = req.body;
    const payout = req.body; // body, ou seja, o envio foi feito em formato JSON
    const finded = objArrayPayout.find((element) => element.crash === parseFloat(payout.crash));
    if (!finded) {
        objArrayPayout.push(payout);
        return res.json(payout);
    }
    return res.json(objArrayPayout);
});

// UPDATE UM ELEMENT do ARRAY via BODY
/*app.put("/payouts/:crash", (req, res) => {
  const { crash } = req.params;
  const payout = objArrayPayout.find((pay) => pay.crash == crash);

  const { chance } = req.body;
  payout.chance = chance;

  res.json(payout);
});*/

// UPDATE UM ELEMENT do ARRAY via PARAMS
app.put("/payouts/:crash/:chance", (req, res) => {
    const { crash, chance } = req.params;
    const payout = objArrayPayout.find((pay) => pay.crash === parseFloat(crash));

    payout.chance = parseFloat(chance);

    res.json(payout);
});

app.listen(port, () => console.log(`Servidor rodando em... http://localhost:${port}`));

function writeFile(callback) {
    fs.writeFile(
        path.join(__dirname, "payouts.json"),
        JSON.stringify(objArrayPayout, null, 2),
        (err) => {
            if (err) throw err;
            callback(JSON.stringify({ message: "OK!" }));
        }
    );
}
