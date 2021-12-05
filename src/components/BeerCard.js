import React, { useState, useEffect } from "react";
import "./BeerCard.css";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

function BeerCard() {
  const [data, setState] = useState([]);
  const getBeers = () => {
    fetch("https://api.punkapi.com/v2/beers?per_page=80")
      .then((response) => response.json())
      .then((json) => {
        setState(json);
      });
  };

  useEffect(() => {
    getBeers();
  }, []);

  function compare(a, b) {
    let comparison = 0;
    if (a.abv < b.abv) {
      comparison = 1;
    } else if (a.abv > b.abv) {
      comparison = -1;
    }
    return comparison;
  }

  data.sort(compare);

  //
  data.forEach((beer) => {
    if (
      beer.name.toUpperCase().includes("STOUT") ||
      beer.tagline.toUpperCase().includes("STOUT") ||
      beer.description.toUpperCase().includes("STOUT")
    ) {
      beer.lactose = true;
    }

    let hopsArray = beer.ingredients.hops;
    for (let hop of hopsArray) {
      if (hop.add === "dry hop") {
        beer.dryHopped = true;
      }
    }
  });

  return (
    <section className="beer-container">
      {data.map((beer) => (
        <div key={beer.id} className="beer-card">
          {beer.lactose ? (
            <Stack direction="row" spacing={1}>
              <Chip
                className="dry-hopped"
                label="Dry Hopped"
                variant="outlined"
              />
            </Stack>
          ) : (
            <div></div>
          )}
          <div className="card-media">
            <img src={beer.image_url} alt="Beer" />
          </div>
          <div className="card-content">
            <div className="card-content-title">
              <h2>{beer.name}</h2>
              <h4>"{beer.tagline}"</h4>
            </div>
            <div className="card-content-discription">
              <p>{beer.description}</p>
            </div>
            <div className="card-content-facts">
              <h5>ABV: {beer.abv}</h5>
              <h5>IBU: {beer.ibu}</h5>
            </div>
            {beer.lactose ? (
              <div>
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="warning">
                    This beer may contain lactose!
                  </Alert>
                </Stack>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default BeerCard;
