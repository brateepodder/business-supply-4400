"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Product {
  product_name: string;
  location: string;
  amount_available: number;
  low_price: number;
  high_price: string;
}

export default function LocationsPage() {
  const [owners, setOwners] = useState<Product[]>([]); // State to store the owner data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the owners data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setOwners(data); // Set the owner data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
    <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Products View</h1>
    {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Owners List">
          <TableHeader>
            <TableColumn>PRODUCT NAME</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>AMOUNT AVAILABLE</TableColumn>
            <TableColumn>LOW PRICE</TableColumn>
            <TableColumn>HIGH PRICE</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {owners.map((product) => (
              <TableRow key={product.product_name}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>{product.amount_available}</TableCell>
                <TableCell>{product.low_price}</TableCell>
                <TableCell>{product.high_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
