"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Button,
  Divider,
  Autocomplete,
  AutocompleteItem,
  Input,
  CircularProgress,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import { useConfig } from "../ConfigContext";

// Adjust the interface to match the data from the API
interface Driver {
  username: string;
  licenseID: string;
  successful_trips: number;
  num_vans: number;
}

export default function DriversPage() {
  const { port } = useConfig();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [usernames, setUsernames] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch driver usernames for the Autocomplete
  let driverList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/driver-usernames",
          { signal },
        );

        if (!response.ok) throw new Error("Failed to fetch driver usernames.");

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

  // Fetch usernames for Autocomplete
  let usernameList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/usernames",
          {
            signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch usernames.");

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

  // Fetch delivery service IDs for the Autocomplete
  let deliveryServiceIDs = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all usernames without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/service-ids",
          {
            signal,
          },
        );

        if (!response.ok)
          throw new Error("Failed to fetch delivery service IDs.");

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

  // Fetch the drivers data from the backend
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/drivers");

      if (!response.ok) throw new Error("Failed to fetch drivers");

      const data = await response.json();

      setDrivers(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []); // Runs only once when the component mounts

  // Handle Autocomplete selection
  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "addDriverRole") {
      setAddDriverRoleData((prev) => ({ ...prev, username: value }));
    }
    if (key === "takeoverVanUsername") {
      setTakeoverVanData((prev) => ({ ...prev, username: value }));
    }
    if (key === "takeoverVanServiceID") {
      setTakeoverVanData((prev) => ({ ...prev, id: value }));
    }
    if (key === "removeDriverRole") {
      setRemoveDriverRoleData((prev) => ({ ...prev, username: value }));
    }
  };

  //TAKEOVER VAN
  const [takeoverVanData, setTakeoverVanData] = useState({
    username: "",
    id: "",
    tag: "",
  });

  // Message from backend - takeover_van()
  const [takeoverVanMessage, setTakeoverVanMessage] = useState<string | null>(
    null,
  );

  // Handle funding form input changes
  const handleTakeoverVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTakeoverVanData({
      ...takeoverVanData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle funding form submission
  const handleTakeoverVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddDriverRoleMessage(null);

    if (
      !takeoverVanData.username ||
      !takeoverVanData.id ||
      !takeoverVanData.tag
    ) {
      setTakeoverVanMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/takeover-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(takeoverVanData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setTakeoverVanMessage(result.message);
        await fetchDrivers();
      } else {
        setTakeoverVanMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error taking over van:", error);
      setTakeoverVanMessage("Error taking over van.");
    }
  };

  // REMOVE DRIVER ROLE
  const [removeDriverRoleData, setRemoveDriverRoleData] = useState({
    username: "",
  });

  // Message from backend - remove_driver_role()
  const [removeDriverRoleMessage, setRemoveDriverRoleMessage] = useState<
    string | null
  >(null);

  // Handle remove driver role form input changes
  const handleRemoveDriverRoleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRemoveDriverRoleData({
      ...removeDriverRoleData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle remove driver role submission
  const handleRemoveDriverRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRemoveDriverRoleMessage(null);

    if (!removeDriverRoleData.username) {
      setRemoveDriverRoleMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/remove-driver-role",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(removeDriverRoleData),
        },
      );

      const result = await response.json();

      setRemoveDriverRoleData(result.message);
      await fetchDrivers(); // Refresh the drivers table
    } catch (error) {
      console.error("Error removing driver:", error);
      setRemoveDriverRoleMessage("Error removing driver.");
    }
  };

  const [addDriverRoleData, setAddDriverRoleData] = useState({
    username: "",
    license_id: "",
    license_type: "",
    driver_experience: "",
  });

  //ADD DRIVER ROLE
  // Message from backend - add_driver_role()
  const [addDriverRoleMessage, setAddDriverRoleMessage] = useState<
    string | null
  >(null);

  // Handle funding form input changes
  const handleAddDriverRoleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddDriverRoleData({
      ...addDriverRoleData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle add driver role submission
  const handleAddDriverRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddDriverRoleMessage(null);

    if (
      !addDriverRoleData.username ||
      !addDriverRoleData.license_id ||
      !addDriverRoleData.license_type ||
      !addDriverRoleData.driver_experience
    ) {
      setAddDriverRoleMessage("All fields are required.");

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:" + port + "/api/add-driver-role",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addDriverRoleData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setAddDriverRoleMessage(result.message);
        await fetchDrivers(); // Refresh the drivers table
      } else {
        setAddDriverRoleMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error adding driver role:", error);
      setAddDriverRoleMessage("Error adding driver role.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Driver&apos;s View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of a
        driver.
      </p>
      <p className="text-slate-500 mb-8 text-center">
        For each driver, it includes the username, licenseID and drivering
        experience, along with the number of vans that they are controlling.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Drivers List">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>LICENSE ID</TableColumn>
            <TableColumn>SUCCESSFUL TRIPS</TableColumn>
            <TableColumn>NUMBER OF VANS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {drivers.map((driver) => (
              <TableRow key={driver.username}>
                <TableCell>{driver.username}</TableCell>
                <TableCell>{driver.licenseID}</TableCell>
                <TableCell>{driver.successful_trips}</TableCell>
                <TableCell>{driver.num_vans}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Driver-Related Procedures
      </h1>

      {/* Add Driver Role Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Driver Role
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure adds the driver role to an existing employee.
          The employee/new driver must have a unique license identifier.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4"
              onSubmit={handleAddDriverRoleSubmit}
            >
              <Autocomplete
                className="w-auto max-w-xs"
                inputValue={usernameList.filterText} // Track input value for filtering
                isLoading={usernameList.isLoading} // Show loading state while fetching data
                items={usernameList.items} // Items filtered by the filterText
                label="All Usernames"
                placeholder="Search for a username"
                onInputChange={usernameList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("addDriverRole", selected as string)
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
                label="License ID"
                name="license_id"
                value={addDriverRoleData.license_id}
                onChange={(e) =>
                  setAddDriverRoleData((prev) => ({
                    ...prev,
                    license_id: e.target.value,
                  }))
                }
              />
              <Input
                className="flex-1"
                label="License Type"
                name="license_type"
                value={addDriverRoleData.license_type}
                onChange={(e) =>
                  setAddDriverRoleData((prev) => ({
                    ...prev,
                    license_type: e.target.value,
                  }))
                }
              />
              <Input
                className="flex-1"
                label="Driver Experience (years)"
                name="driver_experience"
                value={addDriverRoleData.driver_experience}
                onChange={(e) =>
                  setAddDriverRoleData((prev) => ({
                    ...prev,
                    driver_experience: e.target.value,
                  }))
                }
              />
              <Button color="primary" type="submit">
                Add driver role
              </Button>
            </form>

            {/* Move message rendering here, outside the form */}
            {addDriverRoleMessage && (
              <div className="mt-8 text-center">
                <p
                  className={`${
                    addDriverRoleMessage.includes("successfully") ||
                    addDriverRoleMessage.includes("Successfully")
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {addDriverRoleMessage}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Takeover Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Takeover Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure allows a valid driver to take control of a van
          owned by the same delivery service. The current controller of the van
          is simply relieved of those dutiesdelivery_services.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 justify-center"
              onSubmit={handleTakeoverVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={driverList.filterText} // Track input value for filtering
                isLoading={driverList.isLoading} // Show loading state while fetching data
                items={driverList.items} // Items filtered by the filterText
                label="Driver Usernames"
                placeholder="Search for a username"
                onInputChange={driverList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "takeoverVanUsername",
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
                inputValue={deliveryServiceIDs.filterText} // Track input value for filtering
                isLoading={deliveryServiceIDs.isLoading} // Show loading state while fetching data
                items={deliveryServiceIDs.items} // Items filtered by the filterText
                label="Delivery Service ID"
                placeholder="Search Delivery Service ID"
                onInputChange={deliveryServiceIDs.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "takeoverVanServiceID",
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
                label="Van Tag"
                name="tag"
                type="text"
                value={takeoverVanData.tag}
                onChange={handleTakeoverVanChange}
              />
              <Button className="w-auto" color="primary" type="submit">
                Takeover Van
              </Button>
            </form>
            {takeoverVanMessage && (
              <p
                className={`text-center mt-8 ${
                  takeoverVanMessage.includes("successfully") ||
                  takeoverVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {takeoverVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Remove Driver Role Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Remove Driver Role
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure removes a driver from the system. The removal
          can occur if, and only if, the driver is not controlling any vans. The
          driver's information must be completely removed from the system.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 justify-center"
              onSubmit={handleRemoveDriverRoleSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={driverList.filterText} // Track input value for filtering
                isLoading={driverList.isLoading} // Show loading state while fetching data
                items={driverList.items} // Items filtered by the filterText
                label="Driver Usernames"
                placeholder="Search for a driver username"
                onInputChange={driverList.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "removeDriverRole",
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
                Remove Driver Role
              </Button>
            </form>

            {removeDriverRoleMessage && (
              <p
                className={`text-center mt-8 ${
                  removeDriverRoleMessage.includes("successfully") ||
                  removeDriverRoleMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {removeDriverRoleMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
