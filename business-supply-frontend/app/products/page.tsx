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
  CircularProgress,
  Divider,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

// Adjust the interface to match the data from the API
interface Product {
  product_name: string;
  location: string;
  amount_available: number;
  low_price: number;
  high_price: string;
}

export default function LocationsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch product barcodes from backend
  let productBarcodes = useAsyncList({
    async load({ signal, filterText }) {
      try {
        // Fetch all product barcode without using filterText
        const response = await fetch(
          "http://localhost:5000/api/product-barcodes",
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
        console.error("Error fetching usernames:", error);
        return { items: [] };
      }
    },
  });

  // Fetch the products data from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) throw new Error("Failed to fetch locations");

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAutocompleteSelect = (key: string, value: string) => {
    if (key === "removeProduct") {
      setRemoveProductData((prev) => ({ ...prev, barcode: value }));
    }
  };

  // REMOVE PRODUCT
  // Handle remove_product() form input change
  const handleRemoveProductChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRemoveProductData({
      ...removeProductData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add owner form
  const [removeProductData, setRemoveProductData] = useState({
    barcode: "",
  });

  // Message from backend - add_owner()
  const [removeProductMessage, setRemoveProductMessage] = useState<
    string | null
  >(null);

  // Handle add_owners() form submission
  const handleRemoveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setRemoveProductMessage(null);

    // Validate form fields
    if (!removeProductData.barcode) {
      setRemoveProductMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", removeProductData);

      const response = await fetch("http://localhost:5000/api/remove-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(removeProductData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setRemoveProductMessage(result.message || "An error occured.");
        await fetchProducts();
      } else {
        setRemoveProductMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setRemoveProductMessage("Failed to add service.");
    }
  };

  // ADD PRODUCT
  // Handle add_product() form input change
  const handleAddProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddProductData({
      ...addProductData,
      [e.target.name]: e.target.value,
    });
  };

  // Form data for add owner form
  const [addProductData, setAddProductData] = useState({
    barcode: "",
    name: "", 
    weight: "",
  });

  // Message from backend - add_owner()
  const [addProductMessage, setAddProductMessage] = useState<string | null>(
    null,
  );

  // Handle add_owners() form submission
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAddProductMessage(null);

    // Validate form fields
    if (!removeProductData.barcode) {
      setAddProductMessage("No fields can be left null.");

      return;
    }

    try {
      console.log("Submitting form with data:", addProductData);

      const response = await fetch("http://localhost:5000/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addProductData),
      });

      const result = await response.json();

      console.log("Response from server:", result);

      if (response.ok) {
        setAddProductMessage(result.message || "An error occured.");
        await fetchProducts();
      } else {
        setAddProductMessage(result.message || "An error occured.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAddProductMessage("Failed to add service.");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-600 text-center my-6">
        Products View
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        This view displays information in the system from the perspective of the
        products. For each product that is being carried by at least one van, it
        includes a list of the various locations where it can be purchased,
        along with the total number of packages that can be purchased and the
        lowest and highest prices at which the product is being sold at that
        location.
      </p>
      {loading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        <Table aria-label="Product List">
          <TableHeader>
            <TableColumn>PRODUCT NAME</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>AMOUNT AVAILABLE</TableColumn>
            <TableColumn>LOW PRICE</TableColumn>
            <TableColumn>HIGH PRICE</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            {products.map((product) => (
              <TableRow key={product.product_name}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>{product.amount_available}</TableCell>
                <TableCell>{product.low_price}</TableCell>
                <TableCell>{product.high_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider className="mt-20 mb-10" />
      <h1 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Product-Related Procedures
      </h1>

      {/* Add Product Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Add Product
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure creates a new product. A new product must have a
          unique barcode.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleAddProductSubmit}
            >
              <Input
                required
                className="flex-1"
                label="Barcode"
                name="barcode"
                type="text"
                value={addProductData.id}
                onChange={handleAddProductChange}
              />
              <Input
                required
                className="flex-1"
                label="Name"
                name="name"
                type="text"
                value={addProductData.long_name}
                onChange={handleAddProductChange}
              />
              <Input
                required
                className="flex-1"
                label="Weight"
                name="weight"
                type="number"
                value={addProductData.home_base}
                onChange={handleAddProductChange}
              />
              <Button color="primary" type="submit">
                Add Product
              </Button>
            </form>

            {addProductMessage && (
              <p
                className={`text-center mt-8 ${
                  addProductMessage.includes("successfully") ||
                  addProductMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {addProductMessage}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Remove Product Form */}
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Remove Product
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          This stored procedure removes a product from the system. The removal
          can occur if, and only if, the product is not being carried by any
          vans.
        </p>
        <Card>
          <div className="my-8 mx-5">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleRemoveProductSubmit}
            >
              <Autocomplete
                className="flex-1"
                inputValue={productBarcodes.filterText} // Track input value for filtering
                isLoading={productBarcodes.isLoading} // Show loading state while fetching data
                items={productBarcodes.items} // Items filtered by the filterText
                label="Product Barcodes"
                placeholder="Search for a username"
                onInputChange={productBarcodes.setFilterText} // Update the filterText on input change
                onSelectionChange={(selected) =>
                  handleAutocompleteSelect("removeProduct", selected as string)
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Button color="primary" type="submit">
                Remove Product
              </Button>
            </form>

            {removeProductMessage && (
              <p
                className={`text-center mt-8 ${
                  removeProductMessage.includes("successfully") ||
                  removeProductMessage.includes("Successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {removeProductMessage}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
