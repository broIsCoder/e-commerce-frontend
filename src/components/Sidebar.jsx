import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import { logout, verifyToken } from '../redux-slices/authSlice';
import {
    LayoutGrid,
    User,
    ShoppingCart,
    ClipboardList,
    LogOut,
    Settings,
    Boxes,
    BadgeDollarSign
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.userInfo.user);
    const authToken = useSelector((state) => state.auth.authToken);

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            const options = {
                method: 'GET',
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            const response = await dispatch(verifyToken('/logout', options));
            if (!response.ok && response.status === 500) {
                throw new Error(`${response.status} ${response.message}`);
            }
            const data = await response.json();
            console.log(data)
            if (!data.success) {
                dispatch(addAlert({ message: data.message, type: "warning" }));
            }
        } catch (error) {
            console.log(error)
            dispatch(addAlert({ message: error.message, type: 'error' }));
        } finally {
            setLoading(false);
            dispatch(logout());
            navigate("/");
        }
    };

    const NavItem = ({ to, icon: Icon, notification = 0, children }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-4 py-2 transition-colors duration-200
                ${isActive
                    ? 'bg-blue-200 dark:bg-primary-dark dark:text-text-dark shadow-md transform scale-105'
                    : 'hover:bg-blue-100 dark:hover:bg-gray-700 text-text-light dark:text-text-dark'
                }
            `}
        >
            <Icon size={20} />
            <span className="flex-1">{children}</span>
            {notification > 0 && (
                <span className="ml-auto bg-gray-800 text-white dark:bg-white dark:text-black text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {notification}
                </span>
            )}
        </NavLink>
    );

    return (
        <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex flex-col h-full">
                <nav className="flex-1 space-y-1 p-4">
                    <NavItem to="/" icon={LayoutGrid}>Products</NavItem>
                    <NavItem to="/me" icon={User}>Profile</NavItem>
                    <NavItem to="/my-cart" icon={ShoppingCart} notification={userInfo?.cart?.items?.length}>
                        My Cart
                    </NavItem>
                    <NavItem to="/my-order" icon={ClipboardList} notification={userInfo?.orders?.filter(order => order?.orderStatus === 'Pending').length}>
                        My Orders
                    </NavItem>
                    <NavItem to="/my-products" icon={Boxes}>My Products</NavItem>
                    <NavItem to="/sell-product" icon={BadgeDollarSign}>Sell a Product</NavItem>
                </nav>

                <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <DarkModeToggle />
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className=" flex items-center justify-start gap-2 px-4 py-2 font-medium hover:bg-secondary-light hover:text-white dark:hover:bg-secondary-dark rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <LogOut size={18} />
                        {loading ? 'Logging out...' : 'Log Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
