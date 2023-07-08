import { Link } from "react-router-dom";
import {
  BsBook,
  BsGlobe,
  BsLightning,
  BsDroplet,
  BsPhone,
} from "react-icons/bs";
import { ServiceCardProps } from "../Types/ServiceCardProps";

export function ServiceCard({ icon, route, title, iconColor }: ServiceCardProps) {
  let IconComponent = null;
  switch (icon) {
    case "BsBook":
      IconComponent = BsBook;
      break;
    case "BsGlobe":
      IconComponent = BsGlobe;
      break;
    case "BsLightning":
      IconComponent = BsLightning;
      break;
    case "BsDroplet":
      IconComponent = BsDroplet;
      break;
    case "BsPhone":
      IconComponent = BsPhone;
      break;
    default:
      break;
  }

  const cardStyles = "bg-sky-700 hover:bg-sky-600 rounded-xl flex flex-col items-center justify-center text-center p-4 text-white";
  const IconStyles = `text-4xl ${iconColor} mb-4`
  return (
    <Link to={route} className={cardStyles}>
      <div className={IconStyles}>
        {IconComponent && <IconComponent />}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
    </Link>
  );
}

