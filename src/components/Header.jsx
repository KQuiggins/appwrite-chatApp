import { LogOut } from "react-feather"
import { useAuth } from "../utils/AuthContext"

const Header = () => {
    const { user, handleUserLogOut } = useAuth();
  return (
    <div id="header--wrapper">
        { user ? (
            <>
                Welcome {user.name}
                <LogOut className="header--link" onClick={handleUserLogOut}/>
            </>
        ) : (
            <button>LOGIN</button>
        )}
    </div>
  )
}

export default Header