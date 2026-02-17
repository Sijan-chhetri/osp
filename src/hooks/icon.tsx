import { useMemo } from "react";
import {
  FaWindows,
  FaMicrosoft,
  FaGoogle,
  FaYoutube,
  FaSpotify,
  FaLinkedin,
} from "react-icons/fa";
import {
  SiVmware,
  SiAutodesk,
  SiNetflix,
  SiGrammarly,
  SiCanva,
  SiAdobe,
} from "react-icons/si";
import {
  MdSecurity,
  MdDesignServices,
  MdCleaningServices,
} from "react-icons/md";
import { BsServer, BsFillKeyFill, BsMicrosoft } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi";
import { AiFillDatabase } from "react-icons/ai";
import { BiSolidVideos } from "react-icons/bi";
import { RiBook3Fill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { TbChartBar } from "react-icons/tb";

interface BrandItem {
  name: string;
  color: string;
  bgColor?: string;
  icon: React.ReactNode;
}

export const useBrands = () => {
  const icons: BrandItem[] = useMemo(
    () => [
      {
        name: "Windows",
        color: "text-blue-600",
        icon: <FaWindows className="text-3xl" />,
      },
      {
        name: "Bundle Keys",
        color: "text-purple-600",
        icon: <BsFillKeyFill className="text-3xl" />,
      },
      {
        name: "Enterprise",
        color: "text-gray-800",
        icon: <MdDesignServices className="text-3xl" />,
      },
      {
        name: "Office 365",
        color: "text-orange-500",
        icon: <BsMicrosoft className="text-3xl" />,
      },
      {
        name: "VMware",
        color: "text-gray-700",
        icon: <SiVmware className="text-3xl" />,
      },
      {
        name: "Power BI",
        color: "text-yellow-600",
        icon: <TbChartBar className="text-3xl" />,
      },
      {
        name: "Project",
        color: "text-green-600",
        icon: <HiDocumentText className="text-3xl" />,
      },
      {
        name: "Visio",
        color: "text-blue-500",
        icon: <FaMicrosoft className="text-3xl" />,
      },
      {
        name: "Access",
        color: "text-red-600",
        icon: <AiFillDatabase className="text-3xl" />,
      },
      {
        name: "Server",
        color: "text-gray-800",
        icon: <BsServer className="text-3xl" />,
      },
      {
        name: "Google Drive",
        color: "text-blue-500",
        bgColor: "bg-blue-500",
        icon: <FaGoogle className="text-3xl" />,
      },
      {
        name: "Lumion",
        color: "text-orange-600",
        icon: <MdDesignServices className="text-3xl" />,
      },
      {
        name: "Autodesk",
        color: "text-red-700",
        icon: <SiAutodesk className="text-3xl" />,
      },
      {
        name: "Parallels Desktop",
        color: "text-gray-800",
        icon: <FaWindows className="text-3xl" />,
      },
      {
        name: "Antivirus",
        color: "text-red-500",
        icon: <MdSecurity className="text-3xl" />,
      },
      {
        name: "ChatGPT",
        color: "text-gray-800",
        bgColor: "bg-teal-500",
        icon: <IoChatbubbleEllipsesSharp className="text-3xl" />,
      },
      {
        name: "YouTube",
        color: "text-red-600",
        icon: <FaYoutube className="text-3xl" />,
      },
      {
        name: "Netflix",
        color: "text-red-500",
        icon: <SiNetflix className="text-3xl" />,
      },
      {
        name: "Grammarly",
        color: "text-blue-600",
        icon: <SiGrammarly className="text-3xl" />,
      },
      {
        name: "Spotify",
        color: "text-green-500",
        bgColor: "bg-green-500",
        icon: <FaSpotify className="text-3xl" />,
      },
      {
        name: "Adobe",
        color: "text-red-600",
        icon: <SiAdobe className="text-3xl" />,
      },
      {
        name: "CorelDRAW",
        color: "text-black",
        icon: <MdDesignServices className="text-3xl" />,
      },
      {
        name: "Design Software",
        color: "text-purple-600",
        icon: <MdDesignServices className="text-3xl" />,
      },
      {
        name: "LinkedIn",
        color: "text-blue-700",
        icon: <FaLinkedin className="text-3xl" />,
      },
      {
        name: "CCleaner",
        color: "text-orange-500",
        icon: <MdCleaningServices className="text-3xl" />,
      },
      {
        name: "Macrorit",
        color: "text-blue-600",
        icon: <HiDocumentText className="text-3xl" />,
      },
      {
        name: "AOMEI",
        color: "text-blue-500",
        icon: <BsServer className="text-3xl" />,
      },
      {
        name: "InVideo",
        color: "text-purple-600",
        icon: <BiSolidVideos className="text-3xl" />,
      },
      {
        name: "Canva",
        color: "text-blue-400",
        icon: <SiCanva className="text-3xl" />,
      },
      {
        name: "Nitro",
        color: "text-orange-600",
        icon: <HiDocumentText className="text-3xl" />,
      },
      {
        name: "QuickBooks",
        color: "text-green-700",
        icon: <RiBook3Fill className="text-3xl" />,
      },
    ],
    []
  );

  return icons;
};
