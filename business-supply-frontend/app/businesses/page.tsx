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
  Divider,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useConfig } from "../ConfigContext";

// Adjust the interface to match the data from the API
interface Contains {
  id: string;
  tag: number;
  barcode: string;
  quantity: number;
  price: number;
}

interface Business {
  long_name: string;
  rating: number;
  spent: number;
  location: string;
}

export default function BusinessesPage() {
  const { port } = useConfig();
  const [contains, setContains] = useState<Contains[]>([]); // State to store the businesses data
  const [businesses, setBusinesses] = useState<Business[]>([]); // State to store the businesses data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the businesses data from the backend
  const fetchBusinesses = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/businesses");

      if (!response.ok) throw new Error("Failed to fetch businesses");

      const data = await response.json();

      setBusinesses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the contains data from the backend
  const fetchContains = async () => {
    try {
      const response = await fetch("http://localhost:" + port + "/api/contains");

      if (!response.ok) throw new Error("Failed to information from contains table.");

      const data = await response.json();

      setContains(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchContains();
  }, []);

  // Fetch locations from backend
  let locations = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const response = await fetch(
          "http://localhost:" + port + "/api/location-names",
          {
            signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch locations.");

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
        console.error("Error fetching locations:", error);

        return { items: [] };
      }
    },
  });

  // Fetch business names from backend
  let businessNames = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const response = await fetch(
          "http://localhost:" + port + "/api/businesses-names",
          {
            signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch business names.");

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

  // Fetch service ids names from backend
  let serviceIDs = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const response = await fetch("http://localhost:" + port + "/api/service-ids", {
          signal,
        });

        if (!response.ok) throw new Error("Failed to fetch business names.");

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

  // Fetch product barcodes names from backend
  let productBarcodes = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const response = await fetch("http://localhost:" + port + "/api/product-barcodes", {
          signal,
        });

        if (!response.ok) throw new Error("Failed to fetch business names.");

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
    if (key === "addBusinessLocation") {
      setAddBusinessData((prev) => ({ ...prev, location: value }));
    }
    if (key == "purchaseProductBusiness") {
      setPurchaseProductData((prev) => ({ ...prev, business: value }));
    }
    if (key == "purchaseProductServiceID") {
      setPurchaseProductData((prev) => ({ ...prev, id: value }));
    }
    if (key == "purchaseProductBarcode") {
      setPurchaseProductData((prev) => ({ ...prev, barcode: value }));
    }
  };

  // ADD BUSINESS
  // Handle add_business() form input change
  const handleAddBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddBusinessData({
      ...addBusinessData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add van form
  const [addBusinessData, setAddBusinessData] = useState({
    name: "",
    rating: "",
    spent: "",
    location: "",
  });

  // Message from backend - add_business()
  const [addBusinessMessage, setAddBusinessMessage] = useState<string | null>(
    null,
  );

  // Handle add_business() form submission
  const handleAddBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddBusinessMessage(null);

    // Validate form fields
    if (
      !addBusinessData.name ||
      !addBusinessData.spent ||
      !addBusinessData.rating ||
      !addBusinessData.location
    ) {
      setAddBusinessMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addBusinessData);

      const response = await fetch("http://localhost:" + port + "/api/add-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addBusinessData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setAddBusinessMessage(result.message || "An error occured.");
        await fetchBusinesses();
      } else {
        setAddBusinessMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddBusinessMessage("Failed to add van.");
    }
  };

  // PURCHASE PRODUCT
  // Handle purchase_product() form input change
  const handlePurchaseProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseProductData({
      ...purchaseProductData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for purchase product form
  const [purchaseProductData, setPurchaseProductData] = useState({
    business: "",
    id: "",
    tag: "",
    barcode: "",
    quantity: "",
  });

  // Message from backend - purchase_product()
  const [purchaseProductMessage, setPurchaseProductMessage] = useState<string | null>(
    null,
  );

  // Handle purchase_product() form submission
  const handlePurchaseProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setPurchaseProductMessage(null);

    // Validate form fields
    if (
      !purchaseProductData.business ||
      !purchaseProductData.id ||
      !purchaseProductData.tag ||
      !purchaseProductData.barcode ||
      !purchaseProductData.quantity
    ) {
      setAddBusinessMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", purchaseProductData);

      const response = await fetch("http://localhost:" + port + "/api/purchase-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseProductData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setPurchaseProductMessage(result.message || "An error occured.");
        await fetchBusinesses();
      } else {
        setPurchaseProductMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setPurchaseProductMessage("Failed to add van.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Business Table
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This table displays information in the system from the perspective of
        the businesses. Each business has a long name, a rating, how much they
        have spent on products from delivery services and their location.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Businesses List">
          <TableHeader>
            <TableColumn>LONG NAME</TableColumn>
            <TableColumn>RATING</TableColumn>
            <TableColumn>AMOUNT SPENT</TableColumn>
            <TableColumn>LOCATION</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {businesses.map((business, index) => (
              <TableRow key={index}>
                <TableCell>{business.long_name}</TableCell>
                <TableCell>{business.rating}</TableCell>
                <TableCell>{business.spent}</TableCell>
                <TableCell>{business.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <h1 className="text-4xl mt-20 font-bold text-gray-600 text-center my-6">
        Contain Table
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This table displays information in the system from the perspective of
        what products the van contains. 
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Contains List">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TAG</TableColumn>
            <TableColumn>BARCODE</TableColumn>
            <TableColumn>QUANTITY</TableColumn>
            <TableColumn>PRICE</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {contains.map((contains, index) => (
              <TableRow key={index}>
                <TableCell>{contains.id}</TableCell>
                <TableCell>{contains.tag}</TableCell>
                <TableCell>{contains.barcode}</TableCell>
                <TableCell>{contains.quantity}</TableCell>
                <TableCell>{contains.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Business-Related Procedures
      </h1>

      {/* Add Business Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Business
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new business. A new business must have
          a unique (long) name and must exist at a valid location, and have a
          valid rating. And a resturant is initially &quot;independent&quot;
          (i.e., no owner), but will be assigned an owner later for funding
          purposes.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddBusinessSubmit}
            >
              <Input
                //
                className="flex-1"
                label="Business Name"
                name="name"
                type="text"
                value={addBusinessData.name}
                onChange={handleAddBusinessChange}
              />
              <Input
                //
                className="flex-1"
                label="Rating"
                name="rating"
                type="number"
                value={addBusinessData.rating}
                onChange={handleAddBusinessChange}
              />
              <Input
                //
                className="flex-1"
                label="Spent"
                name="spent"
                type="number"
                value={addBusinessData.spent}
                onChange={handleAddBusinessChange}
              />
              <Autocomplete
                className="flex-1"
                inputValue={locations.filterText} // Track input value for filtering
                isLoading={locations.isLoading} // Show loading state while fetching data
                items={locations.items} // Items filtered by the filterText
                label="Locations"
                placeholder="Search for a locations"
                onInputChange={locations.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "addBusinessLocation",
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
                Add Business
              </Button>
            </form>

            {addBusinessMessage && (
              <p
                className={`text-center mt-8 ${
                  addBusinessMessage.includes("successfully") ||
                  addBusinessMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addBusinessMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Purchase Product Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Purchase Product
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure allows a business to purchase products from a
          van at its current location. The van must have the desired quantity of
          the product being purchased. And the business must have enough money
          to purchase the products. If the transaction is otherwise valid, then
          the van and business information must be changed appropriately.
          Finally, we need to ensure that all quantities in the payload table
          (post transaction) are greater than zero.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handlePurchaseProductSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={businessNames.filterText}
                isLoading={businessNames.isLoading}
                items={businessNames.items}
                label="Businesses"
                placeholder="Search for a business"
                onInputChange={businessNames.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "purchaseProductBusiness",
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
                inputValue={serviceIDs.filterText}
                isLoading={serviceIDs.isLoading}
                items={serviceIDs.items}
                label="Delivery Service IDs"
                placeholder="Search for a delivery service"
                onInputChange={serviceIDs.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "purchaseProductServiceID",
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
                type="number"
                value={purchaseProductData.tag}
                onChange={handlePurchaseProductChange}
              />
              <Autocomplete
                className="flex-1"
                inputValue={productBarcodes.filterText}
                isLoading={productBarcodes.isLoading}
                items={productBarcodes.items}
                label="Product Barcode"
                placeholder="Search for a barcode"
                onInputChange={productBarcodes.setFilterText}
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect(
                    "purchaseProductBarcode",
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
                label="Quantity"
                name="quantity"
                type="number"
                value={purchaseProductData.quantity}
                onChange={handlePurchaseProductChange}
              />
              <Button
                className="col-start-2 col-span-1 row-start-3"
                color="primary"
                type="submit"
              >
                Purchase Product
              </Button>
            </form>

            {purchaseProductMessage && (
              <p
                className={`text-center mt-8 ${
                  purchaseProductMessage.includes("successfully") ||
                  purchaseProductMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {purchaseProductMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
