import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import IndividualManga from "./Pages/IndividualManga/IndividualManga";
import Reader from "./Pages/Reader/Reader";
import MangaCoverList from "./Pages/MangaCoverList/MangaCoverList";
import Library from "./Pages/Library/Library";
import AccountPage from "./Pages/AccountPage/AccountPage";
import Login from "./Pages/Login/Login";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import { CircularProgress } from "@mui/material";
import { ThemeProvider } from "./contexts/ThemeContext";

import GlobalStyle from "./styles/global";
import Layout from "./Components/Layout/Layout";
import { useEffect, useState } from "react";
import { getUserDetails } from "./api/Account";
import { fetchAccountDetails } from "./api/AccountDetails";
import { AccountDetails } from "./interfaces/AccountDetailsInterfaces";
import { Account } from "./interfaces/AccountInterfaces";
import { refreshTokenFunction, isTokenExpired } from "./api/Account";

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const validateTokens = async () => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      console.error(
        "Access token is expired or missing. Attempting to refresh.",
      );

      if (refreshToken) {
        try {
          accessToken = await refreshTokenFunction(refreshToken);
          localStorage.setItem("accessToken", accessToken);
        } catch (error) {
          console.error("Refresh token failed.");
          return null;
        }
      } else {
        console.error("No refresh token found.");
        return null;
      }
    }

    return accessToken;
  };

  const fetchAccount = async () => {
    try {
      setLoading(true);

      const accessToken = await validateTokens();
      if (!accessToken) {
        setAccount(null);
        setAccountDetails(null);
        return;
      }

      const account = await getUserDetails();
      if (account) {
        setAccount(account);

        const accountDetails = await fetchAccountDetails(account.id);
        setAccountDetails(accountDetails);
      } else {
        setAccount(null);
        setAccountDetails(null);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      setAccount(null);
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "99vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "white" }} size={25} />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Layout
          account={account === null ? null : account}
          accountDetails={accountDetails === null ? null : accountDetails}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home account={account} accountDetails={accountDetails} />
              }
            />
            <Route
              path="/manga/:id"
              element={
                <IndividualManga
                  accountId={account === null ? null : account.id}
                  contentFilter={
                    accountDetails === null ? 3 : accountDetails.contentFilter
                  }
                />
              }
            />
            <Route path="/reset/password/:email" element={<ResetPassword />} />
            <Route
              path="/mangaCoverList"
              element={
                <MangaCoverList
                  account={account}
                  accountDetails={accountDetails}
                />
              }
            />
            <Route path="/reader" element={<Reader account={account} />} />
            <Route
              path="/library"
              element={
                <Library account={account} accountDetails={accountDetails} />
              }
            />
            <Route
              path="/account"
              element={
                <AccountPage account={account} fetchAccount={fetchAccount} />
              }
            />
            <Route
              path="/login"
              element={<Login fetchAccount={fetchAccount} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
