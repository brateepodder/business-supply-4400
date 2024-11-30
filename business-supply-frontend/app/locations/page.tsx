"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Owner {
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
  const [owners, setOwners] = useState<Owner[]>([]); // State to store the owner data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the owners data from the backend
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/owners");
        if (!response.ok) throw new Error("Failed to fetch owners");

        const data = await response.json();
        setOwners(data); // Set the owner data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchOwners();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
    <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Owners View</h1>
    {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Owners List">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>BUSINESS COUNT</TableColumn>
            <TableColumn>LOCATION COUNT</TableColumn>
            <TableColumn>HIGHEST RATING</TableColumn>
            <TableColumn>LOWEST RATING</TableColumn>
            <TableColumn>TOTAL DEBT</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {owners.map((owner) => (
              <TableRow key={owner.username}>
                <TableCell>{owner.username}</TableCell>
                <TableCell>{`${owner.first_name} ${owner.last_name}`}</TableCell>
                <TableCell>{owner.num_businesses}</TableCell>
                <TableCell>{owner.num_places}</TableCell>
                <TableCell>{owner.highs}</TableCell>
                <TableCell>{owner.lows}</TableCell>
                <TableCell>{owner.debt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
