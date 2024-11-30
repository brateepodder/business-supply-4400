"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Business {
  long_name: string;
  rating: number;
  spent: number;
  location: string;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]); // State to store the businesses data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the businesses data from the backend
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/businesses");
        if (!response.ok) throw new Error("Failed to fetch businesses");

        const data = await response.json();
        setBusinesses(data); // Set the business data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchBusinesses();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Businesses View</h1>
      {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Businesses List">
          <TableHeader>
            <TableColumn>LONG NAME</TableColumn>
            <TableColumn>RATING</TableColumn>
            <TableColumn>AMOUNT SPENT</TableColumn>
            <TableColumn>LOCATION</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {businesses.map((business, index) => (
              <TableRow key={index}>
                <TableCell>{business.long_name}</TableCell>
                <TableCell>{business.rating}</TableCell>
                <TableCell>{business.spent}</TableCell>
                <TableCell>{business.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
