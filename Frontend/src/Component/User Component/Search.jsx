

import React, { useEffect } from 'react'
import { useState } from 'react';
import '../css/Popup.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



function Search() {
  const today = new Date().toISOString().split('T')[0];
  const [info, setInfo] = useState({
    from: '',
    to: '',
    departure: '',
    return: ''
  });

 

  const [date, setDate] = useState(today);
  const [ret, setReturn] = useState(today);
  const [tripType, setTripType] = useState("Oneway");

  const navigate = useNavigate();

  const [ageBox, setAgeBox] = useState(false);

  function onAge() {
    setAgeBox(!ageBox);
  }

  const [passengers, setPassengers] = useState({
    adult: { selected: false, count: 0 },
    seniorCitizen: { selected: false, count: 0 },
    children: { selected: false, count: 0 }
  });

  const handleCheckboxChange = (group) => {
    setPassengers(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        selected: !prev[group].selected,
        count: !prev[group].selected ? 1 : 0
      }
    }));
  };

   useEffect(()=>{
    if (tripType === "Roundtrip" && info.departure) {
    const depDate = new Date(info.departure);
    const nextDay = new Date(depDate);
    nextDay.setDate(depDate.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    if (!info.return || new Date(info.return) < depDate) {
      setInfo(prev => ({ ...prev, return: nextDayStr }));
    }

    
    setReturn(info.departure);
  }

  } ,[info.departure, tripType])

  async function onSearch() {

    if (info.from.length == 0) {
      toast.error("Source Location can't be Empty");
    } else if (info.to.length == 0) {
      toast.error("Destination Location can't be Empty");
    } else if (info.departure.length == 0) {
      toast.error("Departure date can't be empty ")
    } else if (tripType === "Roundtrip" && info.return.length == 0) {
      toast.error("Return date for RoundTrip can't be empty");
    } else {
      navigate('/show')
    }

  }
    return (
        <div>
            <div className="d-flex align-items-center justify-content-center bg-light rounded p-2 ">

                <label htmlFor="Oneway" style={{ display: 'flex', alignItems: 'center', marginRight: '30px', color: '#009', cursor: 'pointer' }}>
                    <input type="radio" name="triptype" value="Oneway" id='Oneway' checked={tripType === "Oneway"}
                        onChange={() => {
                            setTripType("Oneway")
                        }}

                    />
                    <span className='ml-2'>One Way</span>
                </label>

                <label htmlFor="Roundtrip" style={{ display: 'flex', alignItems: 'center', color: '#009', cursor: 'pointer' }}>
                    <input type="radio" name="triptype" value="Roundtrip" id='Roundtrip'
                        checked={tripType === "Roundtrip"}
                        onChange={() => {
                            setTripType("Roundtrip")
                        }}
                    />
                    <span className='ml-2'>Round Trip</span>
                </label>

            </div>

            <div className="d-flex align-items-center justify-content-around bg-light rounded p-2 " style={{ height: '100px' }} >
                <div className='d-flex flex-column'>
                    <label htmlFor="from">From </label>
                    <input type="search" name="from" id="from" placeholder='Pune' className='p-1 rounded'
                        onChange={(e) => {
                            setInfo({ ...info, from: e.target.value })
                        }}

                        style={{ border: '1px solid #009', outline: '0px' }} />
                </div>

                <div className='d-flex flex-column'>
                    <label htmlFor="to">To </label>
                    <input type="search" name="to" id="to" placeholder='Kochi' className='p-1 rounded'
                        onChange={(e) => {
                            setInfo({ ...info, to: e.target.value })
                        }}
                        style={{ border: '1px solid #009', outline: '0px' }} />
                </div>

                <div className='d-flex flex-column'>
                    <label htmlFor="Departure">Departure </label>
                    <input type="date" name="Departure" id="Departure"
                        min={date} className='p-1 rounded'
                        value={info.departure || date}
                        onChange={(e) => {
                            setInfo({ ...info, departure: e.target.value })
                        }}
                        style={{ border: '1px solid #009', outline: '0px' }} />
                </div>

                <div className='d-flex flex-column'>
                    <label htmlFor="Return">Return </label>
                    <input type="date" name="Return" id="Return"
                        min={ret} className='p-1 rounded'
                        value={ tripType === "Roundtrip" ?  info.return : ''}
                        onChange={(e) => {
                            setInfo({ ...info, return: e.target.value })
                        }}
                        style={{ border: '1px solid #009', outline: '0px' }}
                        disabled={tripType === "Oneway"}
                    />
                </div>

                <div className='d-flex flex-column '>
                    <label htmlFor="Return"> Travellers </label>

                    <div className="popup-container">
                        <button type="button" class="btn btn-outline-dark" onClick={onAge} style={{ width: '70px' }} id='age'>Age</button>

                        {ageBox && (
                            <div className='popup-overlay'>
                                <div className="popup">
                                    {Object.entries(passengers).map(([key, group]) => (
                                        <div key={key} className="mb-2">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={group.selected}
                                                    onChange={() => handleCheckboxChange(key)}
                                                />
                                                {key === "adult" ? "Adults (12–59 yrs)" :
                                                    key === "seniorCitizen" ? "Senior Citizen (>60 yrs)" :
                                                        "Children (2–12 yrs)"}

                                                {group.selected && (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={group.count}
                                                        onChange={(e) =>
                                                            setPassengers(prev => ({
                                                                ...prev,
                                                                [key]: {
                                                                    ...prev[key],
                                                                    count: parseInt(e.target.value) || 0
                                                                }
                                                            }))
                                                        }
                                                        style={{ width: '60px', marginLeft: 'auto' }}
                                                    />
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>

                <div className='d-flex' >
                    <button type="button" className="btn btn-outline-warning " style={{ marginTop: "35px", borderRadius: '35px', width: '100px' }} onClick={onSearch}  >Search</button>
                </div>

            </div>
        </div>
    )
}

export default Search
