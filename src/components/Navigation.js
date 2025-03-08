import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSpring, animated } from "react-spring";

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const dropdownAnimation = useSpring({
    opacity: isProfileDropdownOpen ? 1 : 0,
    transform: isProfileDropdownOpen ? "translateY(0)" : "translateY(-10px)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <li>
            <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/todo" className={({ isActive }) => (isActive ? "active" : "")}>
              Todo List
            </NavLink>
          </li>
        </div>
        {user && (
          <li style={{ position: "relative" }}>
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              Profile Settings
            </button>
            {isProfileDropdownOpen && (
              <animated.ul style={dropdownAnimation}>
                <li>
                  <NavLink
                    to="/profile/view"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    View Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile/update"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Update Profile
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </animated.ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavigationBar;