import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Forecast from "./components/Forecast";
import Home from "./components/Home";
import Error from "./components/Error";
import { addDays, addHours, closestTo, formatISO } from "date-fns";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState();
  const [date, setDate] = useState();
  const [changeDate, setChangeDate] = useState(0);
  const [celsius, setCelsius] = useState();
  const [precipitationCategory, setPrecipitationCategory] = useState();

  const url = "http://localhost:9000";

  useEffect(() => {
    // axios is not necessary but i wanted to try it out, a fetch() would just be fine to use.
    axios
      .get(url)
      .then((response) => {
        setWeatherData(response.data);

        let currentDate = new Date(response.data.timeSeries[0].validTime);

        let currentDateCorrectHour = addHours(currentDate, -1);
        // I´m changing the data depending on what button the user is clicking.
        let currentDateCorrectHourAfterChangeDate = addDays(
          currentDateCorrectHour,
          changeDate
        );

        let validTimeArray = response.data.timeSeries.map(
          (e) => new Date(currentDateCorrectHourAfterChangeDate)
        );
        // Beacause not every date from the API data has weather for every hour i need to loop throw the data and pick out the closest data that is for the moment choosen by the user.
        let chooseCorrectValidTime = closestTo(
          currentDateCorrectHourAfterChangeDate,
          validTimeArray
        );

        setDate(formatISO(chooseCorrectValidTime));

        let filteredValidTime = response.data.timeSeries.filter(
          (e) => e.validTime.substring(0, 13) === date
        );
        // As mentioned earlier not all dates have every hour available then i use this "backup variable" and there i am not as strict to collect data because I am not including hours in my filter.
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
            weatherData={weatherData}
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
