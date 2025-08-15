import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import ImageView from '../department/modals/ImageView';
import { BiSolidUserDetail } from "react-icons/bi";

const departmentsDetail = () => {
  const { id } = useParams(); // Get the id parameter from URL

  const [plansWithApplicant, setplansWithApplicant] = useState([]);
  const [applicant, setApplicant] = useState([]);
  const [letters, setLetters] = useState([]);
  const [role, setRole] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    fname: '',
    lname: '',
    plan_subject: '',
    plan_description: '',
    plan_status: '',
  });
  const [sortCriteria, setSortCriteria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Fetch plan with applicants
  useEffect(() => {
    Axios.get(`http://localhost:5000/api/plan/plan-applicant`)
      .then((res) => setplansWithApplicant(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Fetch applicants
  useEffect(() => {
    Axios.get("http://localhost:5000/getApplicant")
      .then((res) => setApplicant(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Fetch letters
  useEffect(() => {
    Axios.get("http://localhost:5000/api/letters/getLetters")
      .then((res) => setLetters(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Fetch roles
  useEffect(() => {
    Axios.get("http://localhost:5000/getRole")
      .then((res) => setRole(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [departments, setdepartments] = useState([]);
     Axios.get("http://localhost:5000/getdepartment")
      .then((res) => setdepartments(res.data))
      .catch((err) => console.log(err));

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Function to handle filter change
  const handleFilterChange = (criteria, value) => {
    setFilterCriteria({
      ...filterCriteria,
      [criteria]: value,
    });
  };

  // Function to handle sort change
  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  // Function to open modal with selected image
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    console.log("Opening modal with image:", image);
    setSelectedImage(image);
  };

  // Function to close modal
  const closeModal = () => {
    console.log("Closing modal");
    setSelectedImage(null);
  };

  // Filtered and paginated plan
//   const filteredplans = plansWithApplicant.filter((plan) => plan.role_id == id);
// Filtered and paginated plan
const filteredplans = plansWithApplicant.filter((plan) =>
    plan.department == id &&
    (plan.fname.toLowerCase().includes(searchText.toLowerCase()) ||
     plan.lname.toLowerCase().includes(searchText.toLowerCase()) ||
     plan.plan_subject.toLowerCase().includes(searchText.toLowerCase()) ||
     plan.plan_description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Function to sort filtered plan based on sort criteria
  const sortedplans = [...filteredplans].sort((a, b) => {
    if (sortCriteria === 'fname') {
      return a.fname.localeCompare(b.fname);
    } else if (sortCriteria === 'lname') {
      return a.lname.localeCompare(b.lname);
    } else if (sortCriteria === 'plan_subject') {
      return a.plan_subject.localeCompare(b.plan_subject);
    } else if (sortCriteria === 'plan_description') {
      return a.plan_description.localeCompare(b.plan_description);
    } else if (sortCriteria === 'plan_status') {
      return a.plan_status - b.plan_status;
    } else {
      return 0;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedplans.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Ceo</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Dashboard</a>
              </li>
              <li className="breadcrumb-item active">Ceo</li>
            </ol>
          </nav>
        </div>
        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                {departments.map((department) =>
                  department.department_Id == id ? (
                    <div key={department.department_Id} className="col-xxl-4 col-md-6">
                      <div className="card info-card sales-card">
                        <div className="filter">
                          <a className="icon" href="#" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots" />
                          </a>
                         

                          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <li className="dropdown-header text-start">
                          <h6>Filter</h6>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '')}>
                            All
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '1')}>
                            Hawassa
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '2')}>
                            Centeral
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '3')}>
                            North
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '4')}>
                            South
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="" onClick={() => handleFilterChange('departmentlist', '5')}>
                            East
                          </a>
                        </li>
                        
                      </ul>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">
                            {department.department_Name} | {filterCriteria.departmentlist || 'All'}
                          </h5>
                          <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                              <i className="bi bi-people" />
                            </div>
                            <div className="ps-3">
                              <h6>{filteredplans.length}</h6>
                              <span className="text-muted small pt-2 ps-1">plan</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <h5 className="card-title">plan</h5>
                      <div className="mb-3 d-flex">
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Search..."
                          value={searchText}
                          onChange={handleSearchChange}
                        />
                        <select
                          className="form-select me-2"
                          value={sortCriteria}
                          onChange={(e) => handleSortChange(e.target.value)}
                        >
                          <option value="">Sort By</option>
                          <option value="fname">First Name</option>
                          <option value="lname">Last Name</option>
                          <option value="plan_subject">Subject</option>
                          <option value="plan_description">Description</option>                    
                          <option value="plan_status">Status</option>
                        </select>
                      </div>
                      <table className="table table-borderless datatable">
                        <thead>
                          <tr>
                            <th scope="col"> Name</th>
                            <th scope="col">department</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Description</th>
                            <th scope="col">Documents</th>
                            <th scope="col">department</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((plan, index) => (
                            <tr key={index}>
                              <td>{plan.fname+" "+plan.lname}</td>
                              <td> {role.map((roles) => (
                                roles.role_id == plan.role_id ? `${roles.role_name}` : ""
                              ))}</td>
                              <td>{plan.plan_subject}</td>
                              
                              <td>{plan.plan_description}</td>
                              <td>
                              {letters.filter((lett) => lett.plan_id == plan.plan_id).length > 0 ? (
                                <ol>
                                    {letters
                                    .filter((lett) => lett.plan_id == plan.plan_id)
                                    .map((lett, idx) => (
                                        <li key={idx}>
                                        <button className="btn btn-link" onClick={() => openModal(lett.image)}>
                                            {lett.tagname}
                                        </button>
                                        </li>
                                    ))}
                                </ol>
                                ) : (
                                <p>No documents</p>
                                )}





                              </td>
                              <td>
                                <span>
                                  {plan.department == 1
                                    ? 'Hawassa'
                                    : plan.department == 2
                                    ? 'Centeral'
                                    : plan.department == 3
                                    ? 'North'
                                    : plan.department == 4
                                    ? 'South'
                                    : plan.department == 5
                                    ? 'East'
                                    : 'Other'}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success">
                                  {plan.plan_status == 1
                                    ? 'Completed'
                                    : plan.plan_status == 2
                                    ? 'Completed'
                                    : plan.plan_status == 3
                                    ? 'Appointed'
                                    : plan.plan_status == 4
                                    ? 'Referred'
                                    : plan.plan_status == 5
                                    ? 'Rejected'
                                    : 'Refers from'}
                                </span>
                              </td>
                              <td>
                                <Link to={`/details/${plan.plan_id}`} className="btn btn-info">
                                <BiSolidUserDetail /> 
                                </Link>
                            </td>
                            </tr>
                          ))}
                        </tbody>
                        
                      </table>
                      {currentItems.length == 0 && <p>No plan to display.</p>}
                      
                      <nav>
                        <ul className="pagination">
                          {Array.from({ length: Math.ceil(filteredplans.length / itemsPerPage) }).map((_, index) => (
                            <li key={index} className="page-item">
                              <a
                                href="#"
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                      {selectedImage && <ImageView row={selectedImage} onClose={closeModal} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default departmentsDetail;
