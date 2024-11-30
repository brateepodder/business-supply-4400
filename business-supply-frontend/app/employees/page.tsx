"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Employee {
  username: string;
  taxID: string;
  salary: number;
  hired: string;
  employee_experience: number;
  licenseID: string;
  driver_experience: number;
  manager_status: string;
}

export default function LocationsPage() {
  const [owners, setOwners] = useState<Employee[]>([]); // State to store the owner data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the owners data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setOwners(data); // Set the owner data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
    <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Employees View</h1>
    {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
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
                <TableCell>{employee.driver_experience}</TableCell>
                <TableCell>{employee.manager_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
