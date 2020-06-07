import React from 'react';

import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Routes = () => {
    return (
                                //O exact server pra pedir exatidão do router na primeira rota.
        <BrowserRouter>
        
            <Route component={Home} path="/" exact></Route> 
            <Route component={CreatePoint} path="/create-point"></Route>
        
        </BrowserRouter>
    
    );
};

export default Routes;