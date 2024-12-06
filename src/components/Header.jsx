import { Link, useNavigate } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";

const Header = () => {
  const navigate = useNavigate();


  return (
    <div className="font-bold bg-gray-200 text-black p-5 flex justify-between">
      <div className="mx-5 flex items-center">
        <Link
          to={RoutePath.home.path}
          className="text-xl mr-5 text-white text-black-outline"
        >
          {RoutePath.home.name}
        </Link>
      </div>
      <div className="mx-5">
        {/* <Link to={RoutePath.privacypolicy.path} className="text-black mx-2">
          {RoutePath.privacypolicy.name}
        </Link> */}
        <Link to={RoutePath.termsofuse.path} className="text-black mx-2">
          {RoutePath.termsofuse.name}
        </Link>
      </div>
    </div>
  );
};

export default Header;
