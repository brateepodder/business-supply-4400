"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import clsx from "clsx";

export const Navbar = () => {
  // Menu items for navigation links
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Owners", href: "/owners" },
    { label: "Employees", href: "/employees" },
    { label: "Drivers", href: "/drivers" },
    { label: "Locations", href: "/locations" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Vans", href: "/vans" },
    { label: "Businesses", href: "/businesses" },
  ];

  return (
    <NextUINavbar isBordered variant="sticky">
      {/* Navbar Brand (Business Supply) */}
      <NavbarContent className="sm:flex justify-center">
        <NavbarItem>
          <NextLink href="/" className="font-bold text-lg">
            Business Supply
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      {/* Navbar Links centered */}
      <NavbarContent justify="center" className="hidden sm:flex gap-4">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
            <NextLink
              href={item.href}
              className={clsx(
                "text-gray-500 hover:text-blue-500",
                "data-[active=true]:text-blue-600 data-[active=true]:font-bold"
              )}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <NextLink
              href={item.href}
              className="text-gray-500 hover:text-blue-500 w-full"
            >
              {item.label}
            </NextLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* Mobile Menu Toggle Button */}
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle />
      </NavbarContent>
    </NextUINavbar>
  );
};
