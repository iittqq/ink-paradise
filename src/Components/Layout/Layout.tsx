import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import { Account } from "../../interfaces/AccountInterfaces";
import { AccountDetails } from "../../interfaces/AccountDetailsInterfaces";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  account: Account | null;
  accountDetails: AccountDetails | null;
}

const Layout = ({ children, account, accountDetails }: LayoutProps) => {
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
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (currentScrollY === 0) {
      setIsVisible(true);
      return;
    }

    const scrolledDistance = Math.abs(currentScrollY - lastScrollY);

    const isAtBottom = currentScrollY + windowHeight >= documentHeight - 10;

    if (isAtBottom) {
      setIsVisible(false); // Force hiding the header when at the bottom
      return;
    }

    if (scrolledDistance > 50) {
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
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
