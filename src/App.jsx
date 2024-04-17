import { useState, useEffect } from "react";
import "./App.css";
import { data } from "./utils/constants";
import { Col, Container, Form, Row, Table } from "react-bootstrap";

function App() {
  const [jsonData, setJsonData] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setJsonData(data);
    const keys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj))));
    setTableFields(keys);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[name] = checked
        ? [...(updatedFilters[name] || []), value]
        : updatedFilters[name].filter((val) => val !== value);

      return updatedFilters;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderCheckboxes = (field) =>
    Array.from(new Set(jsonData.map((item) => item[field]))).map(
      (value) =>
        value && (
          <div key={`checkbox-${field}-${value}`} className="mb-3">
            <Form.Check
              label={String(value)}
              name={field}
              value={String(value)}
              type="checkbox"
              id={`checkbox-${field}-${value}`}
              onChange={handleFilterChange}
              checked={(filters[field] || []).includes(String(value))}
            />
          </div>
        )
    );

  const filteredData = jsonData.filter(
    (item) =>
      (!searchTerm ||
        (item[tableFields[1]] &&
          item[tableFields[1]]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) &&
      Object.entries(filters).every(([key, values]) =>
        !values.length ? true : values.includes(item[key])
      )
  );

  // console.log("Data:", jsonData, "Search Term:", searchTerm);
  // console.log("Filtered Data:", filteredData);
  // console.log("Filters:", filters);
  // console.log("Table Fields:", tableFields);

  return (
    <Container>
      <h2>Filtered Data</h2>
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search Name..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {tableFields
          .filter((key) => key !== "id" && key !== tableFields[1])
          .map((field) => (
            <Col md={3} key={field}>
              <h4>{field}</h4>
              {renderCheckboxes(field)}
            </Col>
          ))}
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                {tableFields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    {tableFields.map((field) => (
                      <td key={field}>{item[field]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableFields.length} className="text-center">
                    No data found!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
