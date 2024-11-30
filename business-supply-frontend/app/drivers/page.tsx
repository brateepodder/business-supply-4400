"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Driver {
  username: string;
  license_id: string;
  successful_trips: number;
  num_vans: number;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]); // State to store the drivers data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the drivers data from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/drivers");
        if (!response.ok) throw new Error("Failed to fetch drivers");

        const data = await response.json();
        setDrivers(data); // Set the drivers data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchDrivers();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Drivers View</h1>
      {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Drivers List">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>LICENSE ID</TableColumn>
            <TableColumn>SUCCESSFUL TRIPS</TableColumn>
            <TableColumn>NUMBER OF VANS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {drivers.map((driver) => (
              <TableRow key={driver.username}>
                <TableCell>{driver.username}</TableCell>
                <TableCell>{driver.license_id}</TableCell>
                <TableCell>{driver.successful_trips}</TableCell>
                <TableCell>{driver.num_vans}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
