import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorPage from './ErrorPage.jsx';
import LoadingPage from './LoadingPage.jsx';
const App = lazy(() => import('./routes/App.jsx'));
const Root = lazy(() => import('./routes/Root.jsx'));
const Signup = lazy(() => import('./routes/Signup.jsx'));
const Login = lazy(() => import('./routes/Login.jsx'));
const UserInfo = lazy(() => import('./routes/UserInfo.jsx'));
const Products = lazy(() => import('./routes/Products.jsx'));
const MyCart = lazy(() => import('./routes/MyCart.jsx'));
const MyOrder = lazy(() => import('./routes/MyOrder.jsx'));
const Checkout = lazy(() => import('./routes/Checkout.jsx'));
const Product = lazy(() => import('./routes/Product.jsx'));
const Search = lazy(() => import('./routes/Search.jsx'));
const MyProduct = lazy(() => import('./routes/MyProduct.jsx'));
const SellProduct = lazy(() => import('./routes/SellProduct.jsx'));
const MyProducts = lazy(() => import('./routes/MyProducts.jsx'));

const AuthenticatedRouter = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<LoadingPage />}><App /></Suspense>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Suspense fallback={<LoadingPage />}><Root /></Suspense>,
                children: [
                    {
                        path: "/",
                        element: <Suspense fallback={<LoadingPage />}><Products /></Suspense>
                    },
                    {
                        path: "/products/:productId",
                        element: <Suspense fallback={<LoadingPage />}><Product /></Suspense>,
                    },
                    {
                        path: "/me",
                        element: <Suspense fallback={<LoadingPage />}><UserInfo /></Suspense>
                    },
                    {
                        path: "/my-cart",
                        element: <Suspense fallback={<LoadingPage />}><MyCart /></Suspense>
                    },
                    {
                        path: "/my-order",
                        element: <Suspense fallback={<LoadingPage />}><MyOrder /></Suspense>
                    },
                    {
                        path: "/checkout",
                        element: <Suspense fallback={<LoadingPage />}><Checkout /></Suspense>
                    },
                    {
                        path: "/my-products",
                        element: <Suspense fallback={<LoadingPage />}><MyProducts /></Suspense>
                    },
                    {
                        path: "/my-products/product/",
                        element: <Suspense fallback={<LoadingPage />}><MyProduct /></Suspense>
                    },
                    {
                        path: "/sell-product",
                        element: <Suspense fallback={<LoadingPage />}><SellProduct /></Suspense>
                    },
                    {
                        path: "/search",
                        element: <Suspense fallback={<LoadingPage />}><Search /></Suspense>
                    }
                ]
            },
        ]
    }
]);

const UnauthenticatedRouter = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<LoadingPage />}><App /></Suspense>,
        errorElement: <Login />,
        children: [
            {
                path: "/",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            }
        ]
    }
]);

const ConditionalRouter = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const authToken = useSelector((state) => state.auth.authToken);
    return (
        <div className='h-screen'>
            <RouterProvider router={(isLoggedIn && authToken) ? AuthenticatedRouter : UnauthenticatedRouter} />
        </div>
    )
};

export default ConditionalRouter;
