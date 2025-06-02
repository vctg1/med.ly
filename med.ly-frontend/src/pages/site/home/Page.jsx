import React from "react";
import {Grid} from "@mui/material"
import Banner from "./Banner";
import Statistics from "./Statistics";


export default function Home(){
    return (<Grid>
        <Banner/>
        <Statistics/>
    </Grid>)
}