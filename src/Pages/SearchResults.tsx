import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";

const SearchResults = () => {
	const { state } = useLocation();
	return (
		<div>
			<Grid
				container
				direction='row'
				justifyContent='center'
				alignItems='center'
			></Grid>
		</div>
	);
};

export default SearchResults;
