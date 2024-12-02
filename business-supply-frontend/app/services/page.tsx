"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
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

  useEffect(() => {
    fetchServices();
  }, []);

  let workerList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:5000/api/worker-usernames",
          { signal },
        );

        if (!response.ok) throw new Error("Failed to fetch worker's usernames");

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

  let serviceIDs = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch("http://localhost:5000/api/service-ids", {
          signal,
        });

        if (!response.ok)
          throw new Error("Failed to fetch delivery service IDs");

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
        console.error("Error fetching delivery service IDs:", error);
        return { items: [] };
      }
    },
  });

  // MANAGE SERVICE
  // Handle manage_service() form input change
  const handleManageServiceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setManageServiceData({
      ...manageServiceData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add owner form
  const [manageServiceData, setManageServiceData] = useState({
    username: "",
    id: "",
  });

  // Message from backend - add_owner()
  const [manageServiceMessage, setManageServiceMessage] = useState<
    string | null
  >(null);

  // Handle add_owners() form submission
  const handleManageServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setManageServiceMessage(null);

    // Validate form fields
    if (!manageServiceData.username || !manageServiceData.id) {
      setAddServiceMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addServiceData);

      const response = await fetch("http://localhost:5000/api/manage-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manageServiceData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setManageServiceMessage(result.message || "An error occured.");
        await fetchServices();
      } else {
        setManageServiceMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddServiceMessage("Failed to add service.");
    }
  };

  // Handle Autocomplete selection
  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "manageServiceUsername") {
      setManageServiceData((prev) => ({ ...prev, username: value }));
    } else if (key === "manageServiceId") {
      setManageServiceData((prev) => ({ ...prev, id: value }));
    }
  };

  // ADD SERVICE
  // Handle add_service() form input change
  const handleAddServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddServiceData({ ...addServiceData, [e.target.name]: e.target.value });
  };

  // Form data for add owner form
  const [addServiceData, setAddServiceData] = useState({
    id: "",
    long_name: "",
    home_base: "",
    manager: "",
  });

  // Message from backend - add_owner()
  const [addServiceMessage, setAddServiceMessage] = useState<string | null>(
    null,
  );

  // Handle add_owners() form submission
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddServiceMessage(null);

    // Validate form fields
    if (
      !addServiceData.id ||
      !addServiceData.long_name ||
      !addServiceData.home_base ||
      !addServiceData.manager
    ) {
      setAddServiceMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addServiceData);

      const response = await fetch("http://localhost:5000/api/add-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addServiceData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setAddServiceMessage("Successfully added service.");
        await fetchServices();
      } else {
        setAddServiceMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddServiceMessage("Failed to add service.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Services View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of a
        delivery service. It includes the identifier, name, home base location
        and manager for the service, along with the total sales from the vans.
        It must also include the number of unique products along with the total
        cost and weight of those products being carried by the vans.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
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

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Service-Related Procedures
      </h1>

      {/* Add Service Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Service
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new delivery service. A new service
          must have a unique identifier, along with a valid home base and
          manager.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddServiceSubmit}
            >
              <Input
                required
                className="flex-1"
                label="Label"
                name="label"
                type="text"
                value={addServiceData.id}
                onChange={handleAddServiceChange}
              />
              <Input
                required
                className="flex-1"
                label="X Coordinate"
                name="x_coord"
                type="number"
                value={addServiceData.long_name}
                onChange={handleAddServiceChange}
              />
              <Input
                required
                className="flex-1"
                label="Y Coordinate"
                name="y_coord"
                type="number"
                value={addServiceData.home_base}
                onChange={handleAddServiceChange}
              />
              <Input
                required
                className="flex-1"
                label="Location Space"
                name="space"
                type="number"
                value={addServiceData.manager}
                onChange={handleAddServiceChange}
              />
              <Button color="primary" type="submit">
                Add Service
              </Button>
            </form>

            {addServiceMessage && (
              <p
                className={`text-center mt-8 ${
                  addServiceMessage.includes("successfully") ||
                  addServiceMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addServiceMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Manage Service Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Manage Service
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure appoints a worker who is currently hired by a
          delivery service as the new manager for that service. The only
          restrictions is that the worker must not be working for any other
          delivery service. Otherwise, the appointment to manager is permitted.
          The current manager is simply replaced.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleManageServiceSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={workerList.filterText} // Track input value for filtering
                isLoading={workerList.isLoading} // Show loading state while fetching data
                items={workerList.items} // Items filtered by the filterText
                label="Worker Usernames"
                placeholder="Search for a username"
                onInputChange={workerList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "manageServiceUsername",
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
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText} // Track input value for filtering
                isLoading={serviceIDs.isLoading} // Show loading state while fetching data
                items={serviceIDs.items} // Items filtered by the filterText
                label="Delivery Service IDs"
                placeholder="Search for delivery service IDs"
                onInputChange={serviceIDs.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "manageServiceId",
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
              <Button color="primary" type="submit">
                Manage Service
              </Button>
            </form>

            {manageServiceMessage && (
              <p
                className={`text-center mt-8 ${
                  manageServiceMessage.includes("successfully") ||
                  manageServiceMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {manageServiceMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
