"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Card,
  Divider,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import { useConfig } from "../ConfigContext";

interface Employee {
  username: string;
  taxID: string;
  salary: number;
  hired: string;
  employee_experience: number;
  licenseID: string;
  driving_experience: string;
  manager_status: string;
}

export default function LocationsPage() {
  const { port } = useConfig();
  // Add separate states for each autocomplete's filter text
  const [fireEmployeeFilterText, setFireEmployeeFilterText] = useState("");
  const [hireEmployeeFilterText, setHireEmployeeFilterText] = useState("");
  const [owners, setOwners] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch worker's usernames for Autocomplete
  let workerList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/worker-usernames",
          { signal },
        );

        if (!response.ok) throw new Error("Failed to fetch owner usernames");

        const data = await response.json();

        // Filter items locally based on filterText
        const filteredItems = data
          .filter((username: string) =>
            username.toLowerCase().includes(filterText.toLowerCase()),
          )
          .map((username: string) => ({
            label: username,
            value: username,
          }));

        return {
          items: filteredItems,
        };
      } catch (error) {
        console.error("Error fetching usernames:", error);

        return { items: [] };
      }
    },
  });

  // Fetch delivery service IDs for the Autocomplete
  let deliveryServiceIDs = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/service-ids",
          {
            signal,
          },
        );

        if (!response.ok)
          throw new Error("Failed to fetch delivery service IDs.");

        const data = await response.json();

        // Filter items locally based on filterText
        const filteredItems = data
          .filter((username: string) =>
            username.toLowerCase().includes(filterText.toLowerCase()),
          )
          .map((username: string) => ({
            label: username,
            value: username,
          }));

        return {
          items: filteredItems,
        };
      } catch (error) {
        console.error("Error fetching usernames:", error);

        return { items: [] };
      }
    },
  });

  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "hireEmployeeUsername") {
      setHireEmployeeData((prev) => ({ ...prev, username: value }));
    }
    if (key === "fireEmployeeUsername") {
      setFireEmployeeData((prev) => ({ ...prev, username: value }));
    }
    if (key === "hireEmployeeServiceID") {
      setHireEmployeeData((prev) => ({ ...prev, id: value }));
    }
    if (key === "fireEmployeeServiceID") {
      setFireEmployeeData((prev) => ({ ...prev, id: value }));
    }
  };

  // Fetch the owners data from the backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/employees",
      );

      if (!response.ok) throw new Error("Failed to fetch locations");

      const data = await response.json();

      setOwners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [addEmployeeData, setAddEmployeeData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    birthdate: "",
    taxID: "",
    hired: "",
    employee_experience: "",
    salary: "",
  });

  // Message from backend - add_employee()
  const [addEmployeeMessage, setAddEmployeeMessage] = useState<string | null>(
    null,
  );

  // Handle funding form input changes
  const handleAddEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddEmployeeData({ ...addEmployeeData, [e.target.name]: e.target.value });
  };

  // Handle funding form submission
  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddEmployeeMessage(null);

    if (
      !addEmployeeData.username ||
      !addEmployeeData.first_name ||
      !addEmployeeData.last_name ||
      !addEmployeeData.address ||
      !addEmployeeData.birthdate ||
      !addEmployeeData.taxID ||
      !addEmployeeData.salary ||
      !addEmployeeData.employee_experience ||
      !addEmployeeData.hired
    ) {
      setAddEmployeeMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/add-employee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addEmployeeData),
        },
      );

      const result = await response.json();

      setAddEmployeeMessage(result.message);
      await fetchEmployees();
    } catch (error) {
      console.error("Error starting funding:", error);
      setAddEmployeeMessage("Failed to start funding.");
    }
  };

  const [hireEmployeeData, setHireEmployeeData] = useState({
    username: "",
    id: "",
  });

  // Message from backend - hire_employee()
  const [hireEmployeeMessage, setHireEmployeeMessage] = useState<string | null>(
    null,
  );

  // Handle funding form input changes
  const handleHireEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHireEmployeeData({
      ...hireEmployeeData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle funding form submission
  const handleHireEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHireEmployeeMessage(null);

    if (!hireEmployeeData.username || !hireEmployeeData.id) {
      setHireEmployeeMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/hire-employee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hireEmployeeData),
        },
      );


      const result = await response.json();

      if (response.ok) {
        setHireEmployeeMessage(result.message);
      } else {
        setHireEmployeeMessage(result.message || "An error occurred.");
      }
      fetchEmployees();
    } catch (error) {
      console.error("Error hiring employee:", error);
      setHireEmployeeMessage("Failed to hire employee.");
    }
  };

  const [fireEmployeeData, setFireEmployeeData] = useState({
    username: "",
    id: "",
  });

  // Message from backend - fire_employee()
  const [fireEmployeeMessage, setFireEmployeeMessage] = useState<string | null>(
    null,
  );

  // Handle funding form input changes
  const handleFireEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFireEmployeeData({
      ...fireEmployeeData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle funding form submission
  const handleFireEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFireEmployeeMessage(null);

    if (!fireEmployeeData.username || !fireEmployeeData.id) {
      setFireEmployeeMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/fire-employee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fireEmployeeData),
        },
      );

      const result = await response.json();

      setFireEmployeeMessage(result.message);
      await fetchEmployees();
    } catch (error) {
      console.error("Error firing employee:", error);
      setFireEmployeeMessage("Failed to fire employee.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Employees View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of an
        employee.
      </p>
      <p className="text-slate-500 mb-8 text-center">
        For each employee, it includes the username, tax identifier, hiring date
        and experience level, along with the license identifer and drivering
        experience (if applicable), and a YES or NO depending on the manager
        status of the employee.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Owners List">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>TAX ID</TableColumn>
            <TableColumn>SALARY</TableColumn>
            <TableColumn>HIRED</TableColumn>
            <TableColumn>EMPLOYEE EXPERIENCE</TableColumn>
            <TableColumn>LICENSE ID</TableColumn>
            <TableColumn>DRIVER EXPERIENCE</TableColumn>
            <TableColumn>MANAGER STATUS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {owners.map((employee) => (
              <TableRow key={employee.username}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.taxID}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>{employee.hired}</TableCell>
                <TableCell>{employee.employee_experience}</TableCell>
                <TableCell>{employee.licenseID}</TableCell>
                <TableCell>{employee.driving_experience}</TableCell>
                <TableCell>{employee.manager_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Employee-Related Procedures
      </h1>

      {/* Add Employee Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Employee
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new employee without any designated
          driver or worker roles. A new employee must have a unique username and
          a unique tax identifier.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="grid grid-cols-3 gap-5 items-center"
              onSubmit={handleAddEmployeeSubmit}
            >
              <Input
                className="flex-1"
                label="Username"
                name="username"
                type="text"
                value={addEmployeeData.username}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-1"
                label="First Name"
                name="first_name"
                type="text"
                value={addEmployeeData.first_name}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-1"
                label="Last Name"
                name="last_name"
                type="text"
                value={addEmployeeData.last_name}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-1"
                label="Address"
                name="address"
                type="text"
                value={addEmployeeData.address}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-2"
                label="Birthdate"
                name="birthdate"
                type="date"
                value={addEmployeeData.birthdate}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-2"
                label="Tax ID"
                name="taxID"
                type="string"
                value={addEmployeeData.taxID}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-2"
                label="Hired"
                name="hired"
                type="date"
                value={addEmployeeData.hired}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-2"
                label="Experience"
                name="employee_experience"
                type="number"
                value={addEmployeeData.employee_experience}
                onChange={handleAddEmployeeChange}
              />
              <Input
                className="flex-2"
                label="Salary"
                name="salary"
                type="number"
                value={addEmployeeData.salary}
                onChange={handleAddEmployeeChange}
              />
              <Button
                className="col-start-2 col-span-1 row-start-4"
                color="primary"
                type="submit"
              >
                Add Employee
              </Button>
            </form>

            {addEmployeeMessage && (
              <p
                className={`text-center mt-8 ${
                  addEmployeeMessage.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addEmployeeMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Hire Employee Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Hire Employee
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure hires a worker to work for a delivery service.
          If a worker is actively serving as manager for a different service,
          then they are not eligible to be hired. Otherwise, the hiring is
          permitted.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4"
              onSubmit={handleHireEmployeeSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={workerList.filterText} // Track input value for filtering
                isLoading={workerList.isLoading} // Show loading state while fetching data
                items={workerList.items} // Items filtered by the filterText
                label="Worker Usernames"
                placeholder="Search for a username"
                onInputChange={workerList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "hireEmployeeUsername",
                    selected as string,
                  )
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Autocomplete
                className="flex-1"
                inputValue={deliveryServiceIDs.filterText} // Track input value for filtering
                isLoading={deliveryServiceIDs.isLoading} // Show loading state while fetching data
                items={deliveryServiceIDs.items} // Items filtered by the filterText
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={deliveryServiceIDs.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "hireEmployeeServiceID",
                    selected as string,
                  )
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Button color="primary" type="submit">
                Hire Employee
              </Button>
            </form>

            {hireEmployeeMessage && (
              <p
                className={`text-center mt-8 ${
                  hireEmployeeMessage.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {hireEmployeeMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Fire Employee Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Fire Employee
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure fires a worker who is currently working for a
          delivery service. The only restriction is that the employee must not
          be serving as a manager for the service. Otherwise, the firing is
          permitted.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4"
              onSubmit={handleFireEmployeeSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={workerList.filterText} // Track input value for filtering
                isLoading={workerList.isLoading} // Show loading state while fetching data
                items={workerList.items} // Items filtered by the filterText
                label="Worker Usernames"
                placeholder="Search for a username"
                onInputChange={workerList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "fireEmployeeUsername",
                    selected as string,
                  )
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Autocomplete
                className="flex-1"
                inputValue={deliveryServiceIDs.filterText} // Track input value for filtering
                isLoading={deliveryServiceIDs.isLoading} // Show loading state while fetching data
                items={deliveryServiceIDs.items} // Items filtered by the filterText
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={deliveryServiceIDs.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "fireEmployeeServiceID",
                    selected as string,
                  )
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Button color="primary" type="submit">
                Fire Employee
              </Button>
            </form>

            {fireEmployeeMessage && (
              <p
                className={`text-center mt-8 ${
                  fireEmployeeMessage.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {fireEmployeeMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
