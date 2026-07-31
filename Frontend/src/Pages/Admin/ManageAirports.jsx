import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Pagination } from 'react-bootstrap';
import AdminSidebar from "../../Component/Admin/AdminSidebar";

import AdminHeader from "../../Component/Admin/AdminHeader";
import '../../css/ManageAirports.css';
import "../../css/AdminHeader.css";

import { getAirports, addAirport, editAirport, deleteAirport } from '../../Service/airport';
import { toast } from 'react-toastify';

export default function ManageAirports() {
  const [airports, setAirports] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ airportName: '', city: '', country: '', iataCode: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await getAirports();
      setAirports(response);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
      toast.error("Failed to load airports.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ airportName: '', city: '', country: '', iataCode: '' });
    setEditIndex(null);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.airportName || !formData.city || !formData.country || !formData.iataCode) {
        toast.warning("Please fill in all fields.");
        return;
      }

      if (editIndex !== null) {
        const airportId = airports[editIndex].airportId;

        const updatedAirport = await editAirport({
          airportId,
          airportName: formData.airportName,
          city: formData.city,
          country: formData.country,
          iataCode: formData.iataCode
        });

        const updatedAirports = [...airports];
        updatedAirports[editIndex] = updatedAirport;
        setAirports(updatedAirports);
        toast.success('Airport updated successfully!');
      } else {
        const newAirport = await addAirport({
          airportName: formData.airportName,
          city: formData.city,
          country: formData.country,
          iataCode: formData.iataCode
        });

        setAirports([...airports, newAirport]);
        toast.success('Airport added successfully!');
      }

      handleClose();
    } catch (error) {
      console.error('Failed to save airport:', error);
      toast.error('Failed to save airport. Please try again.');
    }
  };

  const handleEdit = (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    if (!airports[realIndex]) return;

    const selectedAirport = airports[realIndex];

    setFormData({
      airportName: selectedAirport.airportName,
      city: selectedAirport.city,
      country: selectedAirport.country,
      iataCode: selectedAirport.iataCode
    });

    setEditIndex(realIndex);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    const airport = airports[realIndex];

    if (!airport) return;

    if (!window.confirm(`Are you sure you want to delete ${airport.airportName}?`)) return;

    try {
      await deleteAirport(airport.airportId);
      toast.success('Airport removed successfully!');
      await fetchAirports();

      if ((currentPage - 1) * itemsPerPage >= airports.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Failed to remove airport:', error);
      toast.error('Failed to remove airport. Please try again.');
    }
  };

  // Filter airports based on searchTerm across multiple fields
  const filteredAirports = airports.filter((airport) =>
    airport.airportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.iataCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAirports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAirports = filteredAirports.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`admin-page-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Header fixed on top */}
      <AdminHeader />

      <div className="admin-body d-flex">
        {/* Sidebar on left */}
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content area */}
        <main className="admin-main flex-grow-1 px-4 pt-4">
          <div className="main-content container-fluid mt-5 pt-3 px-0">
            <h1 className="fw-bold mb-4">Manage Airports</h1>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button onClick={handleShow}>Add Airport</Button>

              {/* Search input */}
              <Form.Control
                type="search"
                placeholder="Search airports by name, city, country or IATA"
                className="w-50"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
              />
            </div>

            <div className="table-responsive shadow-sm rounded">
              <Table striped bordered hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>IATA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAirports.length > 0 ? (
                    currentAirports.map((airport, idx) => (
                      <tr key={airport.airportId}>
                        <td>{indexOfFirstItem + idx + 1}</td>
                        <td>{airport.airportName}</td>
                        <td>{airport.city}</td>
                        <td>{airport.country}</td>
                        <td>{airport.iataCode}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(idx)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(idx)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No Airports Available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx}
                    active={currentPage === idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            )}

            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{editIndex !== null ? 'Edit Airport' : 'Add Airport'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.airportName}
                      onChange={(e) => setFormData({ ...formData, airportName: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>IATA Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.iataCode}
                      onChange={(e) => setFormData({ ...formData, iataCode: e.target.value })}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </main>
      </div>
    </div>
  );
}
