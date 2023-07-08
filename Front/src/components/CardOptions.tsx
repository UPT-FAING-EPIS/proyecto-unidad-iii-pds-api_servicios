import { Link } from "react-router-dom";

export function CardOptions({
  imageSrc,
  altText,
  to,
}: {
  imageSrc: string;
  altText: string;
  to: string;
}) {
  return (
    <Link to={to} className="block sm:inline-block">
      <div className="flex flex-col justify-center items-center w-full h-full rounded-lg mt-2">
        <div className="w-full sm:max-w-xs">
          <div className="relative aspect-w-1 aspect-h-1">
            <div className="absolute inset-0 bg-gray-500 opacity-0 hover:opacity-25 transition duration-300 rounded-lg"></div>
            <img
              src={imageSrc}
              alt={altText}
              className="p-5 w-full h-full object-cover rounded-lg max-w-full max-h-full"
            />
          </div>
        </div>
      </div>
    </Link>

  );
}
