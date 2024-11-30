"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Van {
  id: string;
  tag: string;
  fuel: number;
  capacity: number;
  sales: number;
  driven_by: string;
  located_at: string;
}

export default function VansPage() {
  const [vans, setVans] = useState<Van[]>([]); // State to store the vans data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the vans data from the backend
  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vans");
        if (!response.ok) throw new Error("Failed to fetch vans");

        const data = await response.json();
        setVans(data); // Set the van data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchVans();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Vans View</h1>
      {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Vans List">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TAG</TableColumn>
            <TableColumn>FUEL</TableColumn>
            <TableColumn>CAPACITY</TableColumn>
            <TableColumn>SALES</TableColumn>
            <TableColumn>DRIVEN BY</TableColumn>
            <TableColumn>LOCATED AT</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {vans.map((van) => (
              <TableRow key={van.id}>
                <TableCell>{van.id}</TableCell>
                <TableCell>{van.tag}</TableCell>
                <TableCell>{van.fuel}</TableCell>
                <TableCell>{van.capacity}</TableCell>
                <TableCell>{van.sales}</TableCell>
                <TableCell>{van.driven_by}</TableCell>
                <TableCell>{van.located_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
