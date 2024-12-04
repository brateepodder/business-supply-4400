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
  Button,
  Card,
  Input,
  CircularProgress,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useConfig } from "../ConfigContext";

// Adjust the interface to match the data from the API
interface Business {
  username: string;
}

export default function WorkersPage() {
  const { port } = useConfig();
  const [workers, setWorkers] = useState<Business[]>([]); // State to store the businesses data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the businesses data from the backend
  const fetchWorkers = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/workers");

      if (!response.ok) throw new Error("Failed to fetch workers");

      const data = await response.json();

      setWorkers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Fetch employee usernames names from backend
  let employeeList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const response = await fetch(
          "http://localhost:" + port + "/api/employee-usernames",
          {
            signal,
          },
        );

        if (!response.ok)
          throw new Error("Failed to fetch employee usernames.");

        const data = await response.json();

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
        console.error("Error fetching business names:", error);

        return { items: [] };
      }
    },
  });

  //handle autocomplete selections
  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "addWorkerRoleUsername") {
      setAddWorkerRoleData((prev) => ({ ...prev, username: value }));
    }
  };

  // ADD WORKER ROLE
  // Handle add_worker_role() form input change
  const handleAddWorkerRoleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddWorkerRoleData({
      ...addWorkerRoleData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add worker role form
  const [addWorkerRoleData, setAddWorkerRoleData] = useState({
    username: "",
  });

  // Message from backend - add_worker_role()
  const [addWorkerRoleMessage, setAddWorkerRoleMessage] = useState<
    string | null
  >(null);

  // Handle purchase_product() form submission
  const handleAddWorkerRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddWorkerRoleMessage(null);

    // Validate form fields
    if (!addWorkerRoleData.username) {
      setAddWorkerRoleMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addWorkerRoleData);

      const response = await fetch(
        "http://localhost:" + port + "/api/add-worker-role",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addWorkerRoleData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setAddWorkerRoleMessage(result.message || "An error occured.");
        await fetchWorkers();
      } else {
        setAddWorkerRoleMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddWorkerRoleMessage("Failed to add van.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Workers Table
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This table displays information in the system from the perspective of
        the workers. All workers have an unique username that identifies them.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Businesses List">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {workers.map((worker, index) => (
              <TableRow key={index}>
                <TableCell>{worker.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Worker Role Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Worker Role
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure adds the worker role to an existing employee.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddWorkerRoleSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={employeeList.filterText}
                isLoading={employeeList.isLoading}
                items={employeeList.items}
                label="Employee usernames"
                placeholder="Search for an employee username"
                onInputChange={employeeList.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "addWorkerRoleUsername",
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
              <Button
                className="col-start-2 col-span-1 row-start-3"
                color="primary"
                type="submit"
              >
                Add Worker Role
              </Button>
            </form>

            {addWorkerRoleMessage && (
              <p
                className={` text-center mt-8 ${
                  addWorkerRoleMessage.includes("successfully") ||
                  addWorkerRoleMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addWorkerRoleMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
