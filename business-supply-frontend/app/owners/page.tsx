"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

// Adjust the interface to match the data from the API
interface Owner {
  username: string;
  first_name: string;
  last_name: string;
  address: string;
  num_businesses: number;
  num_places: number;
  highs: number;
  lows: number;
  debt: string;
}

export default function OwnersPage() {

  // State to store owner loading data
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form data for add owner form 
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    birthdate: "",
  });
  
  // Message from backend - add_owner()
  const [message, setMessage] = useState<string | null>(null);

  // Add Owner Form error 
  const [addOwnerFormError, setAddOwnerFormError] = useState<string | null>(
    null,
  );

  // Errors from fetching owner view
  const [tableFetchError, setTableFetchError] = useState<string | null>(null);

  // Form data for start funding form 
  const [fundingData, setFundingData] = useState({
    owner: "",
    amount: "",
    business: "",
    fundDate: "",
  });

  // Message from backend - start_funding()
  const [fundingMessage, setFundingMessage] = useState<string | null>(null);

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
        setTableFetchError("Failed to load the owners list.");
      } finally {
        setLoading(false); // Set loading to false when the request is done
      }
    };

    fetchOwners();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle add-owners form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleAddOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Clear previous messages
    setMessage(null);
    setAddOwnerFormError(null);
  
    // Validate form fields
    if (!formData.username || !formData.birthdate) {
      setAddOwnerFormError("Please add a username and a birthdate.");
      return;
    }
  
    try {
      console.log("Submitting form with data:", formData); // Log form data being sent
  
      const response = await fetch("http://localhost:5000/api/add-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json(); // Parse response JSON
      console.log("Response from server:", result); // Log the response from the server
  
      // Check if the procedure message indicates an error
      if (result.message === "Username already exists, select unique one.") {
        setAddOwnerFormError(result.message); // Display the procedure message as an error
      } else if (response.ok) {
        // On success, update the UI and reset the form
        setMessage("Successfully added owner!"); // Success message
        setFormData({
          username: "",
          first_name: "",
          last_name: "",
          address: "",
          birthdate: "",
        });
  
        // Optionally, refetch owners to refresh the table
        const updatedOwners = await fetch("http://localhost:5000/api/owners");
        const newOwners = await updatedOwners.json();
        setOwners(newOwners);
      } else {
        setAddOwnerFormError(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddOwnerFormError("Failed to add owner.");
    }
  };
  

  return (
    <div className="grid place-items-center min-h-screen">
      {/* Display the heading for the Owners View */}
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Owners View
      </h1>

      {/* Display message related to the owners data */}
      {tableFetchError && (
        <p className="text-center text-red-500 my-4">{tableFetchError}</p>
      )}

      {loading ? (
        <CircularProgress
          aria-label="Loading..."
          color="warning"
          showValueLabel={true}
          size="lg"
          value={100}
        />
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

      {/* Add Owner Form */}
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Owner
        </h2>
        <Card>
          <div className="my-8 mx-5">
            <form className="flex items-center gap-4" onSubmit={handleAddOwnerSubmit}>
              <Input
                className="flex-1"
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                className="flex-1"
                label="First Name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
              />
              <Input
                className="flex-1"
                label="Last Name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
              />
              <Input
                className="flex-1"
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
              <Input
                className="flex-1"
                label="Birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
              />
              <Button color="primary" type="submit">Add Owner</Button>
            </form>

            {/* Display form-specific errors */}
            {addOwnerFormError && (
              <p className="text-center text-red-700 mt-8">
                {addOwnerFormError}
              </p>
            )}

            {/* Display success message */}
            {message && (
              <p className="text-center text-green-700 mt-8">{message}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
