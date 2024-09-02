import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Banco from "../pages/banco/banco";
import Cliente from "../pages/clientes/cliente";
import Home from "../pages/home";
import CadastroPerguntas from "../pages/show/cadastroPerguntas";
import ShowDoMilhao from "../pages/show/jogoMilhao";

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
        },
        {
            path: '/perguntas',
            element: <CadastroPerguntas />
        },
        {
            path: '/jogo',
            element: <ShowDoMilhao />
        }
    ]);

    return <RouterProvider router={routes} />
}