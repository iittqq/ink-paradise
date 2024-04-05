import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import IndividualManga from "./Pages/IndividualManga/IndividualManga";
import Reader from "./Pages/Reader/Reader";
import MangaCoverList from "./Pages/MangaCoverList/MangaCoverList";
import Library from "./Pages/Library/Library";
import AccountPage from "./Pages/AccountPage/AccountPage";
import Login from "./Pages/Login/Login";

//#121212

function App() {
  return (
    <div className="page-details">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/individualView" element={<IndividualManga />}></Route>
          <Route path="/mangaCoverList" element={<MangaCoverList />}></Route>
          <Route path="/reader" element={<Reader />}></Route>
          <Route path="/library" element={<Library />}></Route>
          <Route path="/account" element={<AccountPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
