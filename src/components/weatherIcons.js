import React from 'react';
import weatherConditions from '../data/weather_condition.json';

function getWeatherIcon(code) {
  const weatherCondition = weatherConditions.find(
    (condition) => condition.code === code
  );
  if (weatherCondition) {
    const iconCode = weatherCondition.icon;
    return require(`../assets/${iconCode}.png`);
  }
}

function WeatherIcons({ code }) {
  const weatherIcon = getWeatherIcon(code);
  return <img src={weatherIcon} alt='Weather Icon' />;
}

export default WeatherIcons;
