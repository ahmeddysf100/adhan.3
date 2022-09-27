const express = require('express')
const https = require('https')
const bodyparser = require('body-parser')

const app = express()

app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use("/public", express.static(__dirname + "/public"))


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/', (req, res) => {
    const city = req.body.cityName;
    const url = "https://muslimsalat.com/" + city + "/weekly/5.json?kay=f201f47388mshc4f984a3c1c1acap14551ejsn0a5beb36c21f";
    https.get(url, function (response) {
        console.log("statuscode:", response.statusCode);

        let stockData = "";

        response.on("data", function (data) {
            stockData += data;
        })

        response.on("end", function () {
            const adhanData = JSON.parse(stockData);
            const satus_description = adhanData.status_description 
            if (response.statusCode === 200 && satus_description === "Success.") {
                const state = adhanData.state;
                const country = adhanData.country;
                const method = adhanData.prayer_method_name;
                const gibla = adhanData.qibla_direction;
                const lat = adhanData.latitude;
                const lon = adhanData.longitude;
                const date = adhanData.items[0].date_for
                const fajer = adhanData.items[0].fajr
                const shurooq = adhanData.items[0].shurooq
                const dhuhr = adhanData.items[0].dhuhr
                const asr = adhanData.items[0].asr
                const maghrib = adhanData.items[0].maghrib
                const isha = adhanData.items[0].isha

                res.render("info", {
                    "state": state,
                    "country": country,
                    "method": method,
                    "gibla": gibla,
                    "lat": lat,
                    "lon": lon,
                    "date": date,
                    "fajer": fajer,
                    "shurooq": shurooq,
                    "dhuhr": dhuhr,
                    "asr": asr,
                    "maghrib": maghrib,
                    "isha": isha

                })




            } else if (satus_description != "Success.") {
                  const empty = "";
                  const message ="Could not find your searched location, please use different word/location and try again.";
                res.render("fail", {
                    "satus_description": message,
                    "state": empty,
                    "country": empty,
                    "method": empty,
                    "gibla": empty,
                    "lat": empty,
                    "lon": empty,
                    "date": empty,
                    "fajer": empty,
                    "shurooq": empty,
                    "dhuhr": empty,
                    "asr": empty,
                    "maghrib": empty,
                    "isha": empty
                })
            }

        })
    })
})





app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is Listening on 4000`)
})