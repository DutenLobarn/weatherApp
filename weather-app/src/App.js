import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Forecast from "./components/Forecast";
import Home from "./components/Home";
import Error from "./components/Error";
import { addDays, addHours, closestTo, formatISO } from "date-fns";
import axios from "axios";

function App() {
  const [data, setData] = useState();
  const [date, setDate] = useState();
  const [changeDate, setChangeDate] = useState(0);
  const [celsius, setCelsius] = useState();
  const [precipitationCategory, setPrecipitationCategory] = useState();

  const url =
    "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.072588/lat/59.327076/data.json";

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);

        let currentDate = new Date(response.data.timeSeries[0].validTime);

        let currentDateCorrectHour = addHours(currentDate, -1);

        let currentDateCorrectHourAfterChangeDate = addDays(
          currentDateCorrectHour,
          changeDate
        );

        let validTimeArray = response.data.timeSeries.map(
          (e) => new Date(currentDateCorrectHourAfterChangeDate)
        );

        let chooseCorrectValidTime = closestTo(
          currentDateCorrectHourAfterChangeDate,
          validTimeArray
        );

        setDate(formatISO(chooseCorrectValidTime));

        let filteredValidTime = response.data.timeSeries.filter(
          (e) => e.validTime.substring(0, 13) === date
        );

        let filteredValidTimeBackup = response.data.timeSeries.filter(
          (e) => e.validTime.substring(0, 10) === date.substring(0, 10)
        );

        if (filteredValidTime.length > 0) {
          let filteredTemperature = filteredValidTime[0].parameters.filter(
            (e) => e.name === "t"
          );

          let filteredPrecipitation = filteredValidTime[0].parameters.filter(
            (e) => e.name === "pcat"
          );

          setCelsius(filteredTemperature[0].values[0]);

          setPrecipitationCategory(filteredPrecipitation[0].values[0]);
        } else {
          let filteredTemperature = filteredValidTimeBackup[
            filteredValidTimeBackup.length - 1
          ].parameters.filter((e) => e.name === "t");

          let filteredPrecipitation = filteredValidTimeBackup[
            filteredValidTimeBackup.length - 1
          ].parameters.filter((e) => e.name === "pcat");

          setCelsius(filteredTemperature[0].values[0]);

          setPrecipitationCategory(filteredPrecipitation[0].values[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [date, changeDate]);

  return (
    <Routes>
      <Route path="/" element={<Home date={date} />} />
      <Route
        path="/dates/:yyyyMMddTHH"
        element={
          <Forecast
            data={data}
            celsius={celsius}
            setCelsius={setCelsius}
            precipitationCategory={precipitationCategory}
            setPrecipitationCategory={setPrecipitationCategory}
            changeDate={changeDate}
            setChangeDate={setChangeDate}
          />
        }
      />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
