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

import { ThemeProvider } from "./contexts/ThemeContext";

import GlobalStyle from "./styles/global";

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<IndividualManga />} />
          <Route path="/reset/password/:email" element={<ResetPassword />} />
          <Route path="/mangaCoverList" element={<MangaCoverList />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="/library" element={<Library />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
