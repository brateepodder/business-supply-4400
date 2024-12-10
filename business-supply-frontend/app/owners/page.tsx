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
import { useAsyncList } from "@react-stately/data";

import { useConfig } from "../ConfigContext";

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

interface Funds {
  username: string;
  invested: number;
  invested_date: string;
  business: string;
}

export default function OwnersPage() {
  const { port } = useConfig();
  // State to store owner loading data
  const [owners, setOwners] = useState<Owner[]>([]);
  const [funds, setFunds] = useState<Funds[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the owners data from the backend
  const fetchOwners = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/owners");

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

  const fetchFunds = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/funds");

      if (!response.ok) throw new Error("Failed to fetch funds");

      const data = await response.json();

      setFunds(data); // Set the owner data into state
    } catch (error) {
      console.error(error);
      setTableFetchError("Failed to load the funds list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  // Use useAsyncList to load all usernames and filter locally
  let ownerList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/owner-usernames",
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

  // Use useAsyncList to load all usernames and filter locally
  let businessNamesList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/businesses-names",
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
    if (key === "startFundingUsername") {
      setFundingData((prev) => ({ ...prev, owner: value }));
    }
    if (key === "startFundingBusiness") {
      setFundingData((prev) => ({ ...prev, business: value }));
    }
  };

  // ADD OWNERS
  // Handle add_owners() form input change
  const handleAddOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddOwnerData({ ...addOwnerData, [e.target.name]: e.target.value });
  };

  // Form data for add owner form
  const [addOwnerData, setAddOwnerData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    address: "",
    birthdate: "",
  });

  // Message from backend - add_owner()
  const [addOwnerMessage, setAddOwnerMessage] = useState<string | null>(null);

  // Handle add_owners() form submission
  const handleAddOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddOwnerMessage(null);

    // Validate form fields
    if (
      !addOwnerData.username ||
      !addOwnerData.birthdate ||
      !addOwnerData.first_name ||
      !addOwnerData.last_name ||
      !addOwnerData.address
    ) {
      setAddOwnerMessage("No fields can be left null.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/add-owner",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addOwnerData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      setAddOwnerMessage(result.message || "An error occured.");
      await fetchOwners();
      await fetchFunds();
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddOwnerMessage("Failed to add owner.");
    }
  };

  // START FUNDING
  // Message from backend - start_funding()
  const [fundingMessage, setFundingMessage] = useState<string | null>(null);

  // Errors from fetching owner view
  const [tableFetchError, setTableFetchError] = useState<string | null>(null);

  // Form data for start funding form
  const [fundingData, setFundingData] = useState({
    owner: "",
    amount: "",
    business: "",
    fundDate: "",
  });

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
      const response = await fetch(
        "http://localhost:" + port + "/api/start-funding",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fundingData),
        },
      );

      const result = await response.json();

      setFundingMessage(result.message || "An error occured.");
      await fetchOwners();
      await fetchFunds();
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

      <h1 className="text-4xl font-bold text-gray-600 text-center my-6 mt-16">
        Funds Table
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of a
        fund placed by an owner.
      </p>
      <p className="text-slate-500 mb-8 text-center">
        For each fund, it includes the owner and the business, which is an
        unique combination in this table. It also includes the amount invested
        and the date in which the investment happened.
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
            <TableColumn>INVESTED AMOUNT</TableColumn>
            <TableColumn>INVESTMENT DATE</TableColumn>
            <TableColumn>BUSINESS NAME</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {funds.map((fund) => (
              <TableRow key={fund.username}>
                <TableCell>{fund.username}</TableCell>
                <TableCell>{fund.invested}</TableCell>
                <TableCell>{fund.invested_date}</TableCell>
                <TableCell>{fund.business}</TableCell>
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
                value={addOwnerData.username}
                onChange={handleAddOwnerChange}
              />
              <Input
                className="flex-1"
                label="First Name"
                name="first_name"
                type="text"
                value={addOwnerData.first_name}
                onChange={handleAddOwnerChange}
              />
              <Input
                className="flex-1"
                label="Last Name"
                name="last_name"
                type="text"
                value={addOwnerData.last_name}
                onChange={handleAddOwnerChange}
              />
              <Input
                className="flex-1"
                label="Address"
                name="address"
                type="text"
                value={addOwnerData.address}
                onChange={handleAddOwnerChange}
              />
              <Input
                className="flex-1"
                label="Birthdate"
                name="birthdate"
                type="date"
                value={addOwnerData.birthdate}
                onChange={handleAddOwnerChange}
              />
              <Button color="primary" type="submit">
                Add Owner
              </Button>
            </form>

            {addOwnerMessage && (
              <p
                className={`text-center mt-8 ${
                  addOwnerMessage.toLowerCase().includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addOwnerMessage}
              </p>
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
              <Autocomplete
                className="w-auto max-w-xs"
                inputValue={ownerList.filterText} // Track input value for filtering
                isLoading={ownerList.isLoading} // Show loading state while fetching data
                items={ownerList.items} // Items filtered by the filterText
                label="Owner Usernames"
                placeholder="Search for a username"
                onInputChange={ownerList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "startFundingUsername",
                    selected as string,
                  )
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
              <Autocomplete
                className="w-auto max-w-xs"
                inputValue={businessNamesList.filterText} // Track input value for filtering
                isLoading={businessNamesList.isLoading} // Show loading state while fetching data
                items={businessNamesList.items} // Items filtered by the filterText
                label="Business Names"
                placeholder="Search for a business name"
                onInputChange={businessNamesList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "startFundingBusiness",
                    selected as string,
                  )
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
