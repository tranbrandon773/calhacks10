import { NavLink } from "react-router-dom";
import "./navbar.css";
import LanguageMenu from "./language_menu";
import LogoutButton from "../LogoutButton";

const Navbar = () => {
    return (
        <ul id="navbar">
            <li>
                <NavLink  
                    to="/"
                    activeClassName="active"
                    className="inactive"
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/chat"
                    activeClassName="active"
                    className="inactive"
                >
                    Chat
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/dash"
                    activeClassName="active"
                    className="inactive"
                >
                    Dashboard
                </NavLink>
            </li>
            <li>
                <LanguageMenu />
            </li>
            {/* <li>
                <LogoutButton />
            </li> */}
        </ul>
    );
};

export default Navbar;
