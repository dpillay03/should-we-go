import React from 'react';
import UserInput from './userInput';
import WeatherIcons from '../components/weatherIcons';

const Results = ({ events, formatDateTime }) => {
  return (
    <div>
      <ul className='event-container'>
        {events.map((event) => (
          <li className='event' key={event.id}>
            <div
              className='event-background'
              style={{ backgroundImage: `url(${event.performers[0].image})` }}
            />

            <div className='event-content'>
              <h3 className='event-title'>{event.title}</h3>
              <p className='event-date'>
                <strong>Date: </strong>
                {formatDateTime(event.datetime_local)}
              </p>
              <p className='event-venue'>
                <strong>Venue: </strong> {event.venue.name}
              </p>
              <p className='event-location'>
                <strong>Location:</strong> {event.venue.display_location}{' '}
              </p>
              <a
                className='event-button'
                href={event.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                View Event
              </a>{' '}
              <br />
              {event.weatherData && event.weatherData.temperature && (
                <div className='event-weather'>
                  <div className='weather-icon-container'>
                    <WeatherIcons code={event.weatherData.code} />
                  </div>
                  <div className='weather-info'>
                    <p className='weather-text'>
                      Temperature:&nbsp;&nbsp;
                      {Math.round(event.weatherData.temperature)}
                      <span className='degrees'>°</span>F, &nbsp;&nbsp;
                      {event.weatherData.conditions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className='created-by'>
        App created by <a href='https://danielpillay.com'>Daniel Pillay</a>
      </p>
    </div>
  );
};

export default Results;
