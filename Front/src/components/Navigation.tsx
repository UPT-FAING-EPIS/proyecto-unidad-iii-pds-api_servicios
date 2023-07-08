import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div className="flex items-center justify-center mt-4 bg-blue-900 py-4  rounded-xl">
      <Link to="/Servicios" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 mr-3"
        >
          <path className="text-amber-500 " d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zm5 2h6m-6 3h6m-6 3h6m-9-6h3"></path>
        </svg>
        <h1 className="text-sky-500 text-4xl font-bold">Banca Servicios</h1>
      </Link>
    </div>
  );
}
