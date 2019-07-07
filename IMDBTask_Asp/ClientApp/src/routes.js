import React from "react";
import { Switch, Route } from "react-router-dom";
import Movies from "./Components/Movies";
import Home from "./Components/Home";
import Layout from "./OtherComponents/Layout";
import CreateMovie from "./Components/CreateMovie";
import EditMovie from "./Components/EditMovie";

const Routes = () => (
    <Layout>
        <Switch>
            <Route exact path="/movies" component={Movies} />
            <Route exact path="/createmovie" component={CreateMovie} />
            <Route exact path="/editmovie/:id" component={EditMovie} />
            <Route path="/" component={Home} />
        </Switch>
    </Layout>
);

export default Routes;
