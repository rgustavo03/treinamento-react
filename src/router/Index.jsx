import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Banco from "../pages/banco/banco";
import Cliente from "../pages/clientes/cliente";
import Home from "../pages/home";

export default function Index() {

    const routes = createBrowserRouter([
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/clientes',
            element: <Cliente />
        },
        {
            path: '/banco',
            element: <Banco />
        }
    ]);

    return <RouterProvider router={routes} />
}