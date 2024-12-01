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
  user,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import axios from "axios";
import { useAsyncList } from "@react-stately/data";

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

  // Fetch the owners data from the backend
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

  useEffect(() => {
    fetchOwners();
  }, []);

  // Use useAsyncList to load all usernames and filter locally
  let ownerList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:5000/api/owner-usernames",
          { signal },
        );

        if (!response.ok) throw new Error("Failed to fetch owner usernames");

        const data = await response.json();

        // Filter items locally based on filterText
        const filteredItems = data
          .filter((username: string) =>
            username.toLowerCase().includes(filterText.toLowerCase()),
          )
          .map((username: string) => ({
            label: username,
            value: username,
          }));

        return {
          items: filteredItems,
        };
      } catch (error) {
        console.error("Error fetching usernames:", error);
        return { items: [] };
      }
    },
  });

  // Handle Autocomplete selection
  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "startFunding") {
      setFundingData((prev) => ({ ...prev, owner: value })); // Ensure 'owner' is updated
    }
  };

  // ADD OWNERS - add_owners()
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

  // ADD OWNERS
  // Handle add_owners() form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add_owners() form submission
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
      console.log("Submitting form with data:", formData);

      const response = await fetch("http://localhost:5000/api/add-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (result.message === "Username already exists, select unique one.") {
        setAddOwnerFormError(result.message);
      } else if (response.ok) {
        // On success, update the UI and reset the form
        setMessage("Successfully added owner!");
        setFormData({
          username: "",
          first_name: "",
          last_name: "",
          address: "",
          birthdate: "",
        });

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

  // START FUNDING
  // Message from backend - start_funding()
  const [fundingMessage, setFundingMessage] = useState<string | null>(null);

  // Handle funding form input changes
  const handleFundingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFundingData({ ...fundingData, [e.target.name]: e.target.value });
  };

  // Handle funding form submission
  const handleFundingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFundingMessage(null);

    if (
      !fundingData.owner ||
      !fundingData.amount ||
      !fundingData.business ||
      !fundingData.fundDate
    ) {
      setFundingMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/start-funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip_owner: fundingData.owner,
          ip_amount: parseInt(fundingData.amount),
          ip_long_name: fundingData.business,
          ip_fund_date: fundingData.fundDate,
        }),
      });

      const result = await response.json();

      if (response.ok && result.message === "Successfully started funding.") {
        setFundingMessage("Funding started successfully!");
        await fetchOwners();
      } else {
        setFundingMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error starting funding:", error);
      setFundingMessage("Failed to start funding.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Owners View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of an
        owner.
      </p>
      <p className="text-slate-500 mb-8 text-center">
        For each owner, it includes the owner&apos;s information, along with the
        number of businesses for which they provide funds and the number of
        different places where those businesses are located. It also includes
        the highest and lowest ratings for each of those businesses, as well as
        the total amount of debt based on the money spent purchasing products by
        all of those businesses. And if an owner does not fund any businesses
        then display zeros for the highs, lows and debt.
      </p>

      {/* Display message related to the owners data */}
      {tableFetchError && (
        <p className="text-center text-red-500 my-4">{tableFetchError}</p>
      )}

      {loading ? (
        <CircularProgress aria-label="Loading..." />
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

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Owner-Related Procedures
      </h1>

      {/* Add Owner Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Owner
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new owner. A new owner must have a
          unique username.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddOwnerSubmit}
            >
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
              <Button color="primary" type="submit">
                Add Owner
              </Button>
            </form>

            {/* Display form-specific errors */}
            {addOwnerFormError && (
              <p className="text-center text-red-600 mt-8">
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

      {/* START FUNDING FORM */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Start Funding
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure opens a channel for a business owner to provide
          funds to a business. The owner and business must be valid.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleFundingSubmit}
            >
              {/* <Autocomplete
                className="w-auto max-w-xs"
                defaultItems={username}
                label="Owner Usernames"
                placeholder="Search for a username"
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("startFunding", selected as string)
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete> */}
              <Autocomplete
                className="w-auto max-w-xs"
                inputValue={ownerList.filterText} // Track input value for filtering
                isLoading={ownerList.isLoading} // Show loading state while fetching data
                items={ownerList.items} // Items filtered by the filterText
                label="Owner Usernames"
                placeholder="Search for a username"
                onInputChange={ownerList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("startFunding", selected as string)
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Input
                className="flex-1"
                label="Amount"
                name="amount"
                type="number"
                value={fundingData.amount}
                onChange={handleFundingChange}
              />
              <Input
                className="flex-1"
                label="Business Name"
                name="business"
                type="text"
                value={fundingData.business}
                onChange={handleFundingChange}
              />
              <Input
                className="flex-1"
                label="Funding Date"
                name="fundDate"
                type="date"
                value={fundingData.fundDate}
                onChange={handleFundingChange}
              />
              <Button color="primary" type="submit">
                Start Funding
              </Button>
            </form>
            {fundingMessage && (
              <p
                className={`text-center mt-8 ${
                  fundingMessage.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {fundingMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
