"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Location {
  label: string;
  long_name: string;
  x_coord: string;
  y_coord: string;
  space: number;
  num_vans: number;
  van_ids: string;
  remaining_capacity: number;
}

export default function LocationsPage() {
  const [owners, setOwners] = useState<Location[]>([]); // State to store the owner data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the owners data from the backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/locations");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setOwners(data); // Set the owner data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchLocations();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
    <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Locations View</h1>
    {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Owners List">
          <TableHeader>
            <TableColumn>LABEL</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>X COORDINATE</TableColumn>
            <TableColumn>Y COORDINATE</TableColumn>
            <TableColumn>SPACE</TableColumn>
            <TableColumn>NUMBER OF VANS</TableColumn>
            <TableColumn>VAN IDs</TableColumn>
            <TableColumn>REMAINING CAPACITY</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {owners.map((owner) => (
              <TableRow key={owner.label}>
                <TableCell>{owner.label}</TableCell>
                <TableCell>{owner.long_name}</TableCell>
                <TableCell>{owner.x_coord}</TableCell>
                <TableCell>{owner.y_coord}</TableCell>
                <TableCell>{owner.space}</TableCell>
                <TableCell>{owner.num_vans}</TableCell>
                <TableCell>{owner.van_ids}</TableCell>
                <TableCell>{owner.remaining_capacity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
