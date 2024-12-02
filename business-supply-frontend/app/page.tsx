"use client";

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function Home() {
  return (
    <div>
      <div className="px-4 py-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-600 text-center">
          Welcome to Business Supply
        </h1>
        <p className="text-center mb-4 text-slate-500">
          Manage your business efficiently with our platform.
        </p>
        <p className="text-center text-slate-500">
          In this platform, each page has a view and several stored procedures
          that you can use to add information to the database. The table below
          shows where each of the views and the stored procedures are located
          your convenience.
        </p>
      </div>

      <Table aria-label="Overview of Pages and Procedures">
        <TableHeader>
          <TableColumn>Tab</TableColumn>
          <TableColumn>Procedures</TableColumn>
          <TableColumn>Views</TableColumn>
          <TableColumn>Explanation</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Home Page</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>The home page acts like an introductory page for the TA marking our website. This page says what all the different tabs do, what they contain, and how to navigate.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Owners</TableCell>
            <TableCell>add_owner(), start_funding()</TableCell>
            <TableCell>display_owner_view()</TableCell>
            <TableCell>This page deals with the owners, the owner view, and the functions related to owners and allowing funding.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Employees</TableCell>
            <TableCell>add_employee(), hire_employee(), fire_employee()</TableCell>
            <TableCell>display_employees_view()</TableCell>
            <TableCell>This page manages employee actions, including adding employees, assigning roles, and hiring/firing employees.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Drivers</TableCell>
            <TableCell>add_driver_role(), takeover_van(), remove_driver_role()</TableCell>
            <TableCell>display_drivers_view()</TableCell>
            <TableCell>This page handles driver actions, including assigning drivers, managing vans, and viewing driver details.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Locations</TableCell>
            <TableCell>add_location()</TableCell>
            <TableCell>display_locations_view()</TableCell>
            <TableCell>This page allows managing locations and viewing location details.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Services</TableCell>
            <TableCell>add_service(), manage_service()</TableCell>
            <TableCell>display_services_view()</TableCell>
            <TableCell>This page provides functionality for adding services and managing them.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Products</TableCell>
            <TableCell>add_product(), remove_product()</TableCell>
            <TableCell>display_products_view()</TableCell>
            <TableCell>This page is for managing products, including adding and removing them from the platform.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vans</TableCell>
            <TableCell>add_van(), load_van(), refuel_van(), drive_van(), remove_van()</TableCell>
            <TableCell>Van table</TableCell>
            <TableCell>This page allows management of vans, including adding, loading, refueling, and driving vans.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Businesses</TableCell>
            <TableCell>add_business(), purchase_product()</TableCell>
            <TableCell>Business table</TableCell>
            <TableCell>This page deals with businesses, including adding businesses and managing product purchases.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Workers</TableCell>
            <TableCell>add_worker_role()</TableCell>
            <TableCell>Worker Table</TableCell>
            <TableCell>This page deals with workers and making employees workers of certain services.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
