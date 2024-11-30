"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Service {
  id: string;
  long_name: string;
  home_base: string;
  manager: string;
  revenue: number;
  products_carried: number;
  cost_carried: number;
  weight_carried: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]); // State to store the services data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the services data from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");

        const data = await response.json();
        setServices(data); // Set the services data into state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">Services View</h1>
      {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Services List">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>LONG NAME</TableColumn>
            <TableColumn>HOME BASE</TableColumn>
            <TableColumn>MANAGER</TableColumn>
            <TableColumn>REVENUE</TableColumn>
            <TableColumn>PRODUCTS CARRIED</TableColumn>
            <TableColumn>COST CARRIED</TableColumn>
            <TableColumn>WEIGHT CARRIED</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.long_name}</TableCell>
                <TableCell>{service.home_base}</TableCell>
                <TableCell>{service.manager}</TableCell>
                <TableCell>{service.revenue}</TableCell>
                <TableCell>{service.products_carried}</TableCell>
                <TableCell>{service.cost_carried}</TableCell>
                <TableCell>{service.weight_carried}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
