import React, { useState } from 'react';

const InputFields = ({
  states,
  handleStateChange,
  handleDateChange,
  fetchEvents,
}) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  return (
    <div className='header-inputs'>
      <select
        id='state'
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          handleStateChange(e);
        }}
        placeholder='Select the state'
      >
        <option value=''>Select a state</option>
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name} ({state.abbreviation})
          </option>
        ))}
      </select>

      <input
        type='date'
        id='date'
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          handleDateChange(e);
        }}
      />

      <button id='search' onClick={fetchEvents}>
        Search
      </button>
    </div>
  );
};

export default InputFields;
