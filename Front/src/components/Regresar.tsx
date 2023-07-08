import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export function Regresar({ to }: { to: string }) {
  return (
    <div className="mt-2 flex items-center justify-start py-2 bg-white text-blue-500 hover:text-blue-700 w-auto text-lg">
      <Link to={to} className="flex items-center">
        <IoIosArrowBack className="mr-1" />
        Retornar
      </Link>
    </div>
  );
}
