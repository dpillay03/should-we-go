import React from 'react';
import InputFields from '../auth/inputField';
import { IoCloseOutline } from 'react-icons/io5';
import siteLogo from '../assets/swg-logo.png';

function MobileMenu({
  states,
  handleStateChange,
  handleDateChange,
  fetchEvents,
  isVisible,
  closeMobileMenu,
}) {
  return (
    <div className={`mobile-menu ${isVisible ? 'visible' : ''}`}>
      <IoCloseOutline
        size={50}
        className='menu-close'
        onClick={closeMobileMenu}
      />
      <img
        src={siteLogo}
        alt='Should We Go mobile navigation logo.'
        id='mobile-nav-logo'
      />
      <h1 className='mobile-nav-header'>Should We Go?</h1>
      <InputFields
        className='mobile-input-field'
        states={states}
        handleStateChange={handleStateChange}
        handleDateChange={handleDateChange}
        fetchEvents={fetchEvents}
      />
      <p className='created-by'>
        App created by <a href='https://danielpillay.com'>Daniel Pillay</a>
      </p>
    </div>
  );
}

export default MobileMenu;
