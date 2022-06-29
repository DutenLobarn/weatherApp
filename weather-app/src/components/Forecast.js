import React from "react";
import { Link, useParams } from "react-router-dom";
import "../Style.css";
import { addDays, isValid, formatISO, closestTo } from "date-fns";

import {
  WiDaySunny,
  WiSnow,
  WiRain,
  WiSprinkle,
  WiSnowflakeCold,
  WiCelsius,
} from "weather-icons-react";

export default function Forecast({
  data,
  celsius,
  setCelsius,
  precipitationCategory,
  setPrecipitationCategory,
  changeDate,
  setChangeDate,
}) {
  const { yyyyMMddTHH } = useParams();

  let urlDate = new Date(yyyyMMddTHH);

  if (data) {
    let validTimeArray = data.timeSeries.map((e) => new Date(urlDate));

    let chooseCorrectValidTime = closestTo(urlDate, validTimeArray);

    let formatedChooseCorrectValidTime = formatISO(chooseCorrectValidTime);

    let filteredValidTime = data.timeSeries.filter(
      (e) =>
        e.validTime.substring(0, 13) ===
        formatedChooseCorrectValidTime.substring(0, 13)
    );

    let filteredValidTimeBackup = data.timeSeries.filter(
      (e) =>
        e.validTime.substring(0, 10) ===
        formatedChooseCorrectValidTime.substring(0, 10)
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
  }

  let previousUrlDate;
  let followingUrlDate;
  let previousUrlDate2;
  let followingUrlDate2;

  const result = isValid(urlDate);
  if (result) {
    previousUrlDate = addDays(urlDate, -1);
    followingUrlDate = addDays(urlDate, 1);

    previousUrlDate2 = formatISO(previousUrlDate);
    followingUrlDate2 = formatISO(followingUrlDate);
  }

  return (
    <div className="Container">
      <h2>
        {yyyyMMddTHH.substring(0, 10)} Weather Forecast for the Royal Palace in
        Stockholm
      </h2>
      <p>
        {celsius}
        <WiCelsius size={50} color="#fff" />
      </p>
      <div>
        {precipitationCategory === 0 ? (
          <WiDaySunny size={100} color="#fff" />
        ) : precipitationCategory === 1 ? (
          <WiSnow size={100} color="#fff" />
        ) : precipitationCategory === 2 ? (
          <div className="iconBox">
            <WiSnow size={100} color="#fff" />
            <WiRain size={100} color="#fff" />
          </div>
        ) : precipitationCategory === 3 ? (
          <WiRain size={100} color="#fff" />
        ) : precipitationCategory === 4 ? (
          <WiSprinkle size={100} color="#fff" />
        ) : precipitationCategory === 5 ? (
          <div className="iconBox">
            <WiSnowflakeCold size={100} color="#fff" />
            <WiRain size={100} color="#fff" />
          </div>
        ) : (
          <div className="iconBox">
            <WiSnowflakeCold size={100} color="#fff" />
            <WiSprinkle size={100} color="#fff" />
          </div>
        )}
      </div>
      <div className="btnBox">
        {changeDate > 0 ? (
          <Link to={`/dates/${previousUrlDate2}`}>
            <button
              onClick={() => {
                setChangeDate(changeDate - 1);
              }}
            >
              Previous Date
            </button>
          </Link>
        ) : (
          ""
        )}
        {changeDate < 9 ? (
          <Link to={`/dates/${followingUrlDate2}`}>
            <button
              onClick={() => {
                setChangeDate(changeDate + 1);
              }}
            >
              Following Date
            </button>
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
