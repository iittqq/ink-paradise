
//about us page to display info about the creators of the site and to also link to their githubs/personal sites
//it should dynamically update as people join on the project
import React from 'react';
import { Link } from 'react-router-dom'



const AboutUs = () => {
    
    const creators = [
        { id: 1, name: 'Licc', role: 'Developer' },
        { id: 2, name: 'Dream', role: 'Developer' },
        { id: 3, name: 'Poseidon', role: 'Developer' },
        { id: 4, name: 'Name', role: 'Role' },
    //add more as needed or make it auto somehow
    ]
    
    const websiteGoals = 'Our take on a reader website that allows people to utilize a comfortable browser reader by pulling Manga chapters from the MangaDex API and displaying them using React and Material UI for the frontend and Spring Boot for the backend with future plans to create an app'
    
    
    
    
    return (
        <div>
          <h2>About Us</h2>
    
          {/* List of Creators */}
          <div>
            <h3>Our Team</h3>
            <ul>
              {creators.map((creator) => (
                <li key={creator.id}>
                  {creator.name} - {creator.role}
                </li>
              ))}
            </ul>
          </div>
    
          {/* Website Goals */}
          <div>
            <h3>Our Goals</h3>
            <p>{websiteGoals}</p>
          </div>
        </div>
      );
    };

export default AboutUs;