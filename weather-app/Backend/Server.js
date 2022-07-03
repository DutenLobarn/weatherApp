const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

app.use(express.json());

app.get("/", async function (req, res) {
  let url =
    "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.072588/lat/59.327076/data.json";

  try {
    // axios is not necessary but i wanted to try it out, a fetch() would just be fine to use.
    await axios.get(url).then((result) => res.send(result.data));
  } catch (error) {
    console.log(error);
  }
});

app.listen(9000);
