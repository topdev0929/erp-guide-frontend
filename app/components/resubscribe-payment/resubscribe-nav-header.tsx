import styles from "./resubscribe-nav-header.module.css";
import { TokenService } from "@/app/api/auth";
import MangoLogo from "@/public/full-logo.png";
import Image from "next/image";

const NavHeader = () => {
  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    TokenService.removeToken();
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Image src={MangoLogo} alt="Mango Logo" className={styles.logo} />
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavHeader;
