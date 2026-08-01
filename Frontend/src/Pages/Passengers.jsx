import SlideBar from '../Component/SlideBar';
import Footer from '../Component/Footer';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { infoContext, passengerListContext, passengerListResponseContext } from '../App';
import { countries } from '../Component/country';
import { addPassenger } from '../Service/passenger';
import '../css/Passengers.css';
// import Sidebar from '../Component/SideBar';

function Passengers() {
  const { info } = useContext(infoContext);
  const {passengerList, setPassengerList}= useContext(passengerListContext);
  const { setPassengerRespList} = useContext(passengerListResponseContext);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let count = parseInt(info.passenger);
    const passArray = Array.from({ length: count }, () => ({
      fullName: '',
      dob: '',
      passportNo: '',
      nationality: 'IN',
    }));
    setPassengerList(passArray);
  }, [info.passenger]);

  const onPassengerChange = (index, field, value) => {
    const updatedList = [...passengerList];
    updatedList[index][field] = value;
    setPassengerList(updatedList);
  };
//console.log(passengerList);
  const navigate = useNavigate();

  const onSave = async () => {
    for (let i = 0; i < passengerList.length; i++) {
      const p = passengerList[i];
      if (p.fullName.length === 0) {
        toast.error(`Passenger ${i + 1} Name cannot be empty`);
        return;
      } else if (p.dob.length === 0) {
        toast.error(`Passenger ${i + 1} DOB cannot be empty`);
        return;
      } else if (p.passportNo.length < 8) {
        toast.error(`Passenger ${i + 1} Passport No. is invalid`);
        return;
      }
    }
 
    const result = await addPassenger(passengerList);
    //console.log(result);
    if (result.status === 201) {
      setPassengerRespList(result.data);
      toast.success(result.data);
      navigate('/seat-selection');
      
    } 
  };

  return (
    <div>
      <SlideBar />
      {/* <Sidebar /> */}
      <div className="container mt-4 mb-5">
        <h2 className="text-center title">Passenger Registration</h2>
        <hr />
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {passengerList.map((passenger, index) => (
            <div className="col" key={index}>
              <div className="card shadow passenger-card">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">Passenger {index + 1}</h5>

                  <div className="form-group mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Virat Kohli"
                      onChange={(e) => onPassengerChange(index, 'fullName', e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Date of Birth</label>
                    <input
                      type="date" max={today}
                      className="form-control"
                      onChange={(e) => onPassengerChange(index, 'dob', e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Passport Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="A1234567"
                      onChange={(e) => onPassengerChange(index, 'passportNo', e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Nationality</label>
                    <select
                      className="form-select"
                      value={passenger.nationality}
                      onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                    >
                      {countries.map((country, idx) => (
                        <option key={idx} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {passengerList.length !== 0 && (
          <div className="text-center mt-4">
            <button className="btn btn-primary px-4 py-2 save-btn" onClick={onSave}>
              Save Passengers
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Passengers;
