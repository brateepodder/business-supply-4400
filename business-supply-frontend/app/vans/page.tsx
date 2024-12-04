"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  Divider,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import { useConfig } from "../ConfigContext";

// Adjust the interface to match the data from the API
interface Van {
  id: string;
  tag: string;
  fuel: number;
  capacity: number;
  sales: number;
  driven_by: string;
  located_at: string;
}

export default function VansPage() {
  const { port } = useConfig();
  const [vans, setVans] = useState<Van[]>([]); // State to store the vans data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the vans data from the backend
  const fetchVans = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/vans");

      if (!response.ok) throw new Error("Failed to fetch vans");

      const data = await response.json();

      setVans(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVans();
  }, []);

  // Fetch driver's usernames from backend
  let driversList = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all product barcode without using filterText
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

  // Fetch locations from backend
  let locations = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all product barcode without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/location-names",
          {
            signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch locations.");

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
        console.error("Error fetching locations:", error);

        return { items: [] };
      }
    },
  });

  // Fetch product barcodes from backend
  let productBarcodes = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all product barcode without using filterText
        const response = await fetch(
          "http://localhost:" + port + "/api/product-barcodes",
          { signal },
        );

        if (!response.ok) throw new Error("Failed to fetch product barcodes.");

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
        console.error("Error fetching product barcodes:", error);

        return { items: [] };
      }
    },
  });

  // Fetch delivery service IDs from backend
  let serviceIDs = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all product barcode without using filterText
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
        console.error("Error fetching delivery service IDs:", error);

        return { items: [] };
      }
    },
  });

  //handle autocomplete selections
  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "addVanServiceID") {
      setAddVanData((prev) => ({ ...prev, id: value }));
    }
    if (key === "addVanDriver") {
      setAddVanData((prev) => ({ ...prev, id: value }));
    }
    if (key === "loadVanServiceID") {
      setLoadVanData((prev) => ({ ...prev, id: value }));
    }
    if (key == "loadVanBarcode") {
      setLoadVanData((prev) => ({ ...prev, barcode: value }));
    }
    if (key == "refuelVanServiceID") {
      setLoadVanData((prev) => ({ ...prev, id: value }));
    }
    if (key == "driveVanServiceID") {
      setDriveVanData((prev) => ({ ...prev, id: value }));
    }
    if (key == "driveVanDestination") {
      setDriveVanData((prev) => ({ ...prev, destination: value }));
    }
    if (key == "removeVanServiceID") {
      setRemoveVanData((prev) => ({ ...prev, id: value }));
    }
  };

  // ADD VAN
  // Handle add_van() form input change
  const handleAddVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddVanData({
      ...addVanData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add van form
  const [addVanData, setAddVanData] = useState({
    id: "",
    tag: "",
    fuel: "",
    capacity: "",
    sales: "",
    driven_by: "",
  });

  // Message from backend - add_van()
  const [addVanMessage, setAddVanMessage] = useState<string | null>(null);

  // Handle add_van() form submission
  const handleAddVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddVanMessage(null);

    // Validate form fields
    if (
      !addVanData.id ||
      !addVanData.tag ||
      !addVanData.fuel ||
      !addVanData.capacity ||
      !addVanData.sales ||
      !addVanData.driven_by
    ) {
      setAddVanMessage("Only driven by field can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addVanData);

      const response = await fetch(
        "http://localhost:" + port + "/api/add-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addVanData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setAddVanMessage(result.message || "An error occured.");
        await fetchVans();
      } else {
        setAddVanMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddVanMessage("Failed to add van.");
    }
  };

  // LOAD VAN
  // Handle load_van() form input change
  const handleLoadVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadVanData({
      ...loadVanData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for load van form
  const [loadVanData, setLoadVanData] = useState({
    id: "",
    tag: "",
    barcode: "",
    product_amount: "",
    price: "",
  });

  // Message from backend - load_van()
  const [loadVanMessage, setLoadVanMessage] = useState<string | null>(null);

  // Handle load_van() form submission
  const handleLoadVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setLoadVanMessage(null);

    // Validate form fields
    if (
      !loadVanData.id ||
      !loadVanData.tag ||
      !loadVanData.barcode ||
      !loadVanData.product_amount ||
      !loadVanData.price
    ) {
      setLoadVanData("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", loadVanData);

      const response = await fetch(
        "http://localhost:" + port + "/api/load-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loadVanData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setLoadVanMessage(result.message || "An error occured.");
        await fetchVans();
      } else {
        setLoadVanMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoadVanMessage("Failed to load van.");
    }
  };

  // REFUEL VAN
  // Handle refuel_van() form input change
  const handleRefuelVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefuelVanData({
      ...refuelVanData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for refuel van form
  const [refuelVanData, setRefuelVanData] = useState({
    id: "",
    tag: "",
    fuel: "",
  });

  // Message from backend - refuel_van()
  const [refuelVanMessage, setRefuelVanMessage] = useState<string | null>(null);

  // Handle add_van() form submission
  const handleRefuelVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setRefuelVanMessage(null);

    // Validate form fields
    if (!refuelVanData.id || !refuelVanData.tag || !refuelVanData.fuel) {
      setRefuelVanMessage("No fields can be null.");

      return;
    }

    try {
      console.log("Submitting form with data:", refuelVanData);

      const response = await fetch(
        "http://localhost:" + port + "/api/refuel-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(refuelVanData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setRefuelVanMessage(result.message || "An error occured.");
        await fetchVans();
      } else {
        setRefuelVanMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setRefuelVanMessage("Failed to add van.");
    }
  };

  // DRIVE VAN
  // Handle drive_van() form input change
  const handleDriveVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriveVanData({
      ...driveVandata,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for drive van form
  const [driveVanData, setDriveVanData] = useState({
    id: "",
    tag: "",
    destination: "",
  });

  // Message from backend - drive_van()
  const [driveVanMessage, setDriveVanMessage] = useState<string | null>(null);

  // Handle drive_van() form submission
  const handleDriveVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setDriveVanMessage(null);

    // Validate form fields
    if (!driveVanData.id || !driveVanData.tag || !driveVanData.destination) {
      setDriveVanMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", driveVanData);

      const response = await fetch(
        "http://localhost:" + port + "/api/drive-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driveVanData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setDriveVanMessage(result.message || "An error occured.");
        await fetchVans();
      } else {
        setDriveVanMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setDriveVanMessage("Failed to add van.");
    }
  };

  // REMOVE VAN
  // Handle remove_van() form input change
  const handleRemoveVanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveVanData({
      ...removeVanData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for drive van form
  const [removeVanData, setRemoveVanData] = useState({
    id: "",
    tag: "",
  });

  // Message from backend - add_van()
  const [removeVanMessage, setRemoveVanMessage] = useState<string | null>(null);

  // Handle add_van() form submission
  const handleRemoveVanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setRemoveVanMessage(null);

    // Validate form fields
    if (!removeVanData.id || !removeVanData.tag) {
      setDriveVanMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", removeVanData);

      const response = await fetch(
        "http://localhost:" + port + "/api/remove-van",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(removeVanData),
        },
      );

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setRemoveVanMessage(result.message || "An error occured.");
        await fetchVans();
      } else {
        setRemoveVanMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setRemoveVanMessage("Failed to add van.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Vans Table
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This table displays information in the system from the perspective of
        the vans. Each van has an id that identifies it to its owning delivery
        service and a tag. Both of these uniquely identify each van. Each van
        has a certain amount of fuel and a capacity of products it can hold, and
        it is calculated how much sales each van makes over its career. A van
        may be driven by only one driver at a time and can only be located at a
        businesses location or its owning delivery services home base.
      </p>
      {loading ? (
        <p>Loading...</p> // Display loading text while fetching data
      ) : (
        <Table aria-label="Vans List">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TAG</TableColumn>
            <TableColumn>FUEL</TableColumn>
            <TableColumn>CAPACITY</TableColumn>
            <TableColumn>SALES</TableColumn>
            <TableColumn>DRIVEN BY</TableColumn>
            <TableColumn>LOCATED AT</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {vans.map((van) => (
              <TableRow key={van.id}>
                <TableCell>{van.id}</TableCell>
                <TableCell>{van.tag}</TableCell>
                <TableCell>{van.fuel}</TableCell>
                <TableCell>{van.capacity}</TableCell>
                <TableCell>{van.sales}</TableCell>
                <TableCell>{van.driven_by}</TableCell>
                <TableCell>{van.located_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Van-Related Procedures
      </h1>

      {/* Add Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new van. A new van must be assigned to
          a valid delivery service and must have a unique tag. Also, it must be
          driven by a valid driver initially (i.e., driver works for the same
          service). And the van&apos;s starting location will always be the
          delivery service&apos;s home base by default.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="grid grid-cols-3 gap-5 items-center"
              onSubmit={handleAddVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText} // Track input value for filtering
                isLoading={serviceIDs.isLoading} // Show loading state while fetching data
                items={serviceIDs.items} // Items filtered by the filterText
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={serviceIDs.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "addVanServiceID",
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
                required
                className="flex-1"
                label="Van Tag"
                name="tag"
                type="text"
                value={addVanData.tag}
                onChange={handleAddVanChange}
              />
              <Input
                required
                className="flex-1"
                label="Fuel"
                name="fuel"
                type="number"
                value={addVanData.fuel}
                onChange={handleAddVanChange}
              />
              <Input
                required
                className="flex-1"
                label="Capacity"
                name="capacity"
                type="number"
                value={addVanData.capacity}
                onChange={handleAddVanChange}
              />
              <Input
                required
                className="flex-1"
                label="Sales"
                name="sales"
                type="number"
                value={addVanData.sales}
                onChange={handleAddVanChange}
              />
              <Autocomplete
                className="flex-1"
                inputValue={driversList.filterText}
                isLoading={driversList.isLoading}
                items={driversList.items}
                label="Driver Usernames"
                placeholder="Search for a driver's username"
                onInputChange={driversList.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("addVanDriver", selected as string)
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
                Add Van
              </Button>
            </form>

            {addVanMessage && (
              <p
                className={`text-center mt-8 ${
                  addVanMessage.includes("successfully") ||
                  addVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Load Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Load Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure allows us to add some quantity of fixed-size
          packages of a specific product to a van&apos;s payload so that we can
          sell them for some specific price to other businesses. The van can
          only be loaded if it&apos;s located at its delivery service&apos;s
          home base, and the van must have enough capacity to carry the
          increased number of items.
        </p>

        <p className="text-slate-500 mb-8 text-center">
          The change/delta quantity value must be positive, and must be added to
          the quantity of the product already loaded onto the van as applicable.
          And if the product already exists on the van, then the existing price
          must not be changed.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleLoadVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText}
                isLoading={serviceIDs.isLoading}
                items={serviceIDs.items}
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={serviceIDs.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "loadVanServiceID",
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
                required
                className="flex-1"
                label="Van Tag"
                name="tag"
                type="text"
                value={loadVanData.tag}
                onChange={handleLoadVanChange}
              />
              <Autocomplete
                className="flex-1"
                inputValue={productBarcodes.filterText}
                isLoading={productBarcodes.isLoading}
                items={productBarcodes.items}
                label="Product Barcodes"
                placeholder="Search for a product barcode"
                onInputChange={productBarcodes.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("loadVanBarcode", selected as string)
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Input
                required
                className="flex-1"
                label="Number of products"
                name="product_amount"
                type="number"
                value={loadVanData.product_amount}
                onChange={handleLoadVanChange}
              />
              <Input
                required
                className="flex-1"
                label="Price"
                name="price"
                type="number"
                value={loadVanData.price}
                onChange={handleLoadVanChange}
              />
              <Button color="primary" type="submit">
                Load Van
              </Button>
            </form>

            {loadVanMessage && (
              <p
                className={`text-center mt-8 ${
                  loadVanMessage.includes("successfully") ||
                  loadVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {loadVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Refuel Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Refuel Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure allows us to add more fuel to a van. The van can
          only be refueled if it&apos;s located at the delivery service&apos;s
          home base.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleRefuelVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText}
                isLoading={serviceIDs.isLoading}
                items={serviceIDs.items}
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={serviceIDs.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "refuelVanServiceID",
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
                required
                className="flex-1"
                label="Van Tag"
                name="tag"
                type="text"
                value={refuelVanData.tag}
                onChange={handleRefuelVanChange}
              />
              <Input
                required
                className="flex-1"
                label="Fuel amount"
                name="fuel"
                type="number"
                value={refuelVanData.fuel}
                onChange={handleRefuelVanChange}
              />
              <Button color="primary" type="submit">
                Refuel Van
              </Button>
            </form>

            {refuelVanMessage && (
              <p
                className={`text-center mt-8 ${
                  refuelVanMessage.includes("successfully") ||
                  refuelVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {refuelVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Drive Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Drive Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure allows us to move a single van to a new location
          (i.e., destination). This will also update the respective driver's
          experience and van&apos;s fuel. The main constraints on the van(s)
          being able to move to a new location are fuel and space. A van can
          only move to a destination if it has enough fuel to reach the
          destination and still move from the destination back to home base. And
          a van can only move to a destination if there&apos;s enough space
          remaining at the destination.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleDriveVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText}
                isLoading={serviceIDs.isLoading}
                items={serviceIDs.items}
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={serviceIDs.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "driveVanServiceID",
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
                required
                className="flex-1"
                label="Van Tag"
                name="tag"
                type="text"
                value={driveVanData.tag}
                onChange={handleDriveVanChange}
              />
              <Autocomplete
                className="flex-1"
                inputValue={locations.filterText}
                isLoading={locations.isLoading}
                items={locations.items}
                label="Destination Location"
                placeholder="Search for a location"
                onInputChange={locations.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "driveVanDestination",
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
                Drive Van
              </Button>
            </form>

            {driveVanMessage && (
              <p
                className={`text-center mt-8 ${
                  driveVanMessage.includes("successfully") ||
                  driveVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {driveVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Remove Van Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Remove Van
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure removes a van from the system. The removal can
          occur if, and only if, the van is not carrying any products.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleRemoveVanSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={serviceIDs.filterText}
                isLoading={serviceIDs.isLoading}
                items={serviceIDs.items}
                label="Delivery Service IDs"
                placeholder="Search for a delivery service ID"
                onInputChange={serviceIDs.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "removeVanServiceID",
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
                required
                className="flex-1"
                label="Van Tag"
                name="tag"
                type="text"
                value={removeVanData.tag}
                onChange={handleRemoveVanChange}
              />
              <Button color="primary" type="submit">
                Remove Van
              </Button>
            </form>

            {removeVanMessage && (
              <p
                className={`text-center mt-8 ${
                  removeVanMessage.includes("successfully") ||
                  removeVanMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {removeVanMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
