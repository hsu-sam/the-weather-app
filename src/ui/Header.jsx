import { NavLink } from 'react-router';
import { MdInsights } from 'react-icons/md';
import UnitsDRopdown from './UnitsDRopdown';

function Header() {
  return (
    <header className="flex flex-row justify-between items-center">
      <img
        className="w-34.5 h-7 md:w-50 lg:"
        src="/assets/images/logo.svg"
        alt="Weather Now"
        width="197"
        height="40"
      />
      <div className="flex flex-row gap-4">
        <NavLink
          to="/insights"
          className="flex flex-row gap-2 items-center bg-(--neutral-800) rounded-lg px-2.5"
        >
          <MdInsights style={{ fontSize: '25px' }} />
          <span className="hidden md:block">Insights</span>
        </NavLink>
        <UnitsDRopdown />
      </div>
    </header>
  );
}

export default Header;
