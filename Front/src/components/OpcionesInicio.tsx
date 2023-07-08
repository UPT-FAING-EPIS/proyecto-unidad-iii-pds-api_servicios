import { Link } from "react-router-dom";

export function OpcionesInicio({ to, text }: { to: string; text: string }) {
  return (
    <Link
      to={to}
      className="bg-sky-600 hover:bg-blue-800 text-white py-20 px-16 rounded text-2xl h-40 w-60 text-center flex items-center justify-center"
    >
      {text}
    </Link>
  );
}
