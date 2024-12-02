"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import axios from "axios";
import { useAsyncList } from "@react-stately/data";

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
  const [location, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the locations data from the backend
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/locations");

      if (!response.ok) throw new Error("Failed to fetch locations");

      const data = await response.json();

      setLocations(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []); // Runs only once when the component mounts

  // ADD LOCATION
  // Handle add_locations() form input change
  const handleAddLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddLocationData({ ...addLocationData, [e.target.name]: e.target.value });
  };

  // Form data for add owner form
  const [addLocationData, setAddLocationData] = useState({
    label: "",
    x_coord: "",
    y_coord: "",
    space: "",
  });

  // Message from backend - add_owner()
  const [addLocationMessage, setAddLocationMessage] = useState<string | null>(
    null,
  );

  // Handle add_owners() form submission
  const handleAddLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddLocationMessage(null);

    // Validate form fields
    if (
      !addLocationData.label ||
      !addLocationData.x_coord ||
      !addLocationData.y_coord ||
      !addLocationData.space
    ) {
      setAddLocationMessage("No fields can be left null.");
      return;
    }

    try {
      console.log("Submitting form with data:", addLocationData);

      const response = await fetch("http://localhost:5000/api/add-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addLocationData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (
        response.ok &&
        (result.message.includes("successfully") ||
          result.message.includes("Successfully"))
      ) {
        setAddLocationMessage("Successfully removed driver.");
        await fetchLocations();
      } else {
        setAddLocationMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddLocationMessage("Failed to add location.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Locations View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of a
        location.
      </p>
      <p className="text-slate-500 mb-8 text-center">
        For each location, it includes the label, x- and y- coordinates, along
        with the name of the business or service at that location, the number of
        vans as well as the identifiers of the vans at the location (sorted by
        the tag), and both the total and remaining capacity at the location.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
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
            {location.map((location) => (
              <TableRow key={location.label}>
                <TableCell>{location.label}</TableCell>
                <TableCell>{location.long_name}</TableCell>
                <TableCell>{location.x_coord}</TableCell>
                <TableCell>{location.y_coord}</TableCell>
                <TableCell>{location.space}</TableCell>
                <TableCell>{location.num_vans}</TableCell>
                <TableCell>{location.van_ids}</TableCell>
                <TableCell>{location.remaining_capacity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Location-Related Procedures
      </h1>

      {/* Add Location Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Location
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new location that becomes a new valid
          van destination. A new location must have a unique combination of
          coordinates.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddLocationSubmit}
            >
              <Input
                required
                className="flex-1"
                label="Label"
                name="label"
                type="text"
                value={addLocationData.label}
                onChange={handleAddLocationChange}
              />
              <Input
                required
                className="flex-1"
                label="X Coordinate"
                name="x_coord"
                type="number"
                value={addLocationData.x_coord}
                onChange={handleAddLocationChange}
              />
              <Input
                required
                className="flex-1"
                label="Y Coordinate"
                name="y_coord"
                type="number"
                value={addLocationData.y_coord}
                onChange={handleAddLocationChange}
              />
              <Input
                required
                className="flex-1"
                label="Location Space"
                name="space"
                type="number"
                value={addLocationData.space}
                onChange={handleAddLocationChange}
              />
              <Button color="primary" type="submit">
                Add Location
              </Button>
            </form>

            {addLocationMessage && (
              <p
                className={`text-center mt-8 ${
                  addLocationMessage.includes("successfully") ||
                  addLocationMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addLocationMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
