import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import { Account } from "../../interfaces/AccountInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";

interface LayoutProps {
  children: React.ReactNode;
  account: Account | null;
  accountDetails: AccountDetails | null;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  account,
  accountDetails,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Determine the total distance scrolled since visibility changed
    const scrolledDistance = Math.abs(currentScrollY - lastScrollY);

    // Show or hide header based on the total scroll distance
    if (scrolledDistance > 50) {
      // Change 50 to any threshold you want
      if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Scrolling up
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      }
      setLastScrollY(currentScrollY); // Update the last known position
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`header-container ${isVisible ? "visible" : "hidden"}`}
        ref={headerRef}
      >
        <Header account={account} accountDetails={accountDetails} />
      </div>
      <div
        className="main-content"
        style={{
          marginTop: isVisible ? `${headerHeight}px` : 0,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
