import { Outlet } from "react-router-dom";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NuiNavbar,
} from "@nextui-org/react";
import { useAuth } from "../../contexts/AuthContext";
import { Image } from "@nextui-org/image";
import logo from "../../assets/logo.webp";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <NuiNavbar className="bg-gray-100">
        <Image src={logo} className="w-8 h-8 sm:w-12 sm:h-12"/>
        <NavbarBrand>
          <a href="/" className="font-bold text-inherit">
            OpenWikipedia
          </a>
        </NavbarBrand>
        <NavbarContent justify="end">
          {user && (
            <>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      showFallback
                      as="button"
                      className="transition-transform"
                      size="sm"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem
                      key="profile"
                      className="h-14 gap-2"
                      textValue={`Signed in as ${user.email}`}
                    >
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{user.email}</p>
                    </DropdownItem>
                    <DropdownItem
                      onClick={handleLogout}
                      key="logout"
                      color="danger"
                      textValue="Log Out"
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </NuiNavbar>
      <Outlet />
    </>
  );
};

export default Navbar;
