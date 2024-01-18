import { DisabledByDefaultOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";
import "./AboutUs.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const AboutUs = () => {
  const creatorsArray = [
    { id: 1, name: "Ikaika", role: "Developer" },
    { id: 2, name: "Adam", role: "Developer" },
    { id: 3, name: "Hayden", role: "Developer" },
  ];

  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="about-us-page">
        <Typography>
          Ink Paradise is a small project from a little group of developers. Our
          goal is to hone our web development skills while also creating quick,
          simple, and easy to use online manga reader. :){" "}
        </Typography>
      </div>
      <div className="creators-display">
        {creatorsArray.map((creator) => (
          <Typography
            key={creator.id}
            variant="body1"
            style={{ color: "#ffffff" }}
          >
            {`• ${creator.name} - ${creator.role}`}
          </Typography>
        ))}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
