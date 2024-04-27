import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputFields from './inputField';
import Results from './results';
import homeHero from '../assets/home-hero.png';
import siteLogo from '../assets/swg-logo.png';
import MobileMenu from '../components/mobileMenu';
import { RiMenu5Fill } from 'react-icons/ri';

const weatherToken = process.env.REACT_APP_WEATHER_TOKEN;
const seatGeekToken = process.env.REACT_APP_SEATGEEK_TOKEN;
const states = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
];

function UserInput() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [events, setEvents] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [headerPosition, setHeaderPosition] = useState('fixed');
  const [searchClicked, setSearchClicked] = useState(false);
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes();
    const period = date.getHours() < 12 ? 'am' : 'pm';

    return `${month}-${day}-${year} at ${hour}:${
      minute < 10 ? '0' + minute : minute
    }${period}`;
  }

  const fetchEvents = () => {
    if (selectedState && selectedDate) {
      axios
        .get(
          `https://api.seatgeek.com/2/events?venue.state=${selectedState}&datetime_utc.gte=${selectedDate}&client_id=${seatGeekToken}`
        )
        .then(async (response) => {
          console.log('Events:', response.data.events);
          setEvents(response.data.events);
          setSearchClicked(true);
          for (const event of response.data.events) {
            const {
              venue: { location },
              datetime_local: eventDateTime,
            } = event;
            const { lat, lon } = location;

            const eventTime = new Date(eventDateTime);
            const militaryHour = eventTime.getHours();

            const formattedDate = eventTime.toISOString().split('T')[0];

            const options = {
              method: 'GET',
              url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
              params: {
                q: `${lat},${lon}`,
                dt: formattedDate,
              },
              headers: {
                'X-RapidAPI-Key': `${weatherToken}`,
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
              },
            };

            try {
              const response = await axios.request(options);

              if (response.data.forecast.forecastday[0].hour[militaryHour]) {
                const weatherData =
                  response.data.forecast.forecastday[0].hour[militaryHour];
                const { temp_f, condition, code } = weatherData;

                event.weatherData = {
                  temperature: temp_f,
                  conditions: condition.text,
                  code: condition.code,
                };

                setEvents((prevEvents) => [...prevEvents]);
              } else {
                console.log('Weather data for the selected hour is undefined.');
              }
            } catch (error) {
              console.error('Error fetching weather data:', error);
            }
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      closeMobileMenu();
    } else {
      console.log('Please select a state and date.');
    }
  };

  const fetchWeatherData = async (eventsData) => {
    try {
      if (eventsData.length > 0) {
        const {
          venue: { location },
        } = eventsData[0];
        const { lat, lon } = location;
        const formattedDate = selectedDate.replace(/-/g, '');

        const options = {
          method: 'GET',
          url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
          params: {
            q: `${lat},${lon}`,
            dt: formattedDate,
          },
          headers: {
            'X-RapidAPI-Key': `${weatherToken}`,
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
          },
        };

        const response = await axios.request(options);
        setWeatherData(response.data);
        const updatedEvents = eventsData.map((event) => ({
          ...event,
          weatherData: response.data,
        }));
        setEvents(updatedEvents);
      } else {
        console.log('No events available to fetch weather data.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };
  useEffect(() => {
    setHeaderPosition(overlayVisible ? 'relative' : 'fixed');
  }, [overlayVisible]);

  return (
    <>
      {events.length === 0 ? (
        <div className='home-container'>
          <div className='col'>
            <h1 className='site-header'>Should We Go?</h1>
            <h2 className='site-subheader'>
              Last-minute plans, instant results. Your go-to for events and
              weather, right when you need it.
            </h2>
            <InputFields
              states={states}
              handleStateChange={handleStateChange}
              handleDateChange={handleDateChange}
              fetchEvents={fetchEvents}
            />
          </div>
          <div className='col'>
            <img
              src={homeHero}
              alt='Friends having fun at an event'
              id='home-hero'
            />
          </div>
          <p className='created-by'>
            App created by <a href='https://danielpillay.com'>Daniel Pillay</a>
          </p>
        </div>
      ) : (
        <div className='results'>
          <div
            className={`overlay ${mobileMenuVisible ? 'visible' : ''}`}
            onClick={closeMobileMenu}
          ></div>
          <div className='header' style={{ position: headerPosition }}>
            <img src={siteLogo} id='site-logo' alt='Should We Go logo.' />
            <div className='desktop-header-input'>
              <InputFields
                states={states}
                handleStateChange={handleStateChange}
                handleDateChange={handleDateChange}
                fetchEvents={fetchEvents}
              />
            </div>
            <RiMenu5Fill
              size={50}
              id='mobile-menu-icon'
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
          </div>

          <MobileMenu
            states={states}
            handleStateChange={handleStateChange}
            handleDateChange={handleDateChange}
            fetchEvents={fetchEvents}
            isVisible={mobileMenuVisible}
            closeMobileMenu={closeMobileMenu}
          />
          <div className='app-container'>
            {searchClicked && ( // Render only when search button is clicked
              <h1 className='site-header result'>
                Events in the state of{' '}
                {
                  states.find((state) => state.abbreviation === selectedState)
                    ?.name
                }
              </h1>
            )}
            <Results events={events} formatDateTime={formatDateTime} />
          </div>
        </div>
      )}
    </>
  );
}
export default UserInput;
