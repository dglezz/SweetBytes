import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/">SweetBytes</Link>
      </div>
      <div>
        <Link to="/locations">Locations</Link>
      </div>
    </footer>
  );
}

export default Footer;
