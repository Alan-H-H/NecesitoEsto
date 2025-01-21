import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import Image from "next/image";
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import FloatingButton from "@/components/FloatingButton";

export const Header = () => {
  return (
    <header className="header w-full border-b border-gray-300 py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
        {/* Left Section */}
        <div className="header__left flex items-center justify-center md:justify-start w-full md:w-auto">
          <img src="/logoprincipalsf.png" alt="Logo de Necesito Esto!" width={77} height={77} />
            <Link href="/">
              <h3 className="text-3xl font-bold ml-2">
                Necesito <span className="text-blue-600">Esto!</span>
              </h3>
            </Link>
          
        </div>

        {/* Center Section (Navigation) */}
        <div className="header__center flex flex-wrap justify-center md:justify-start gap-4 w-full md:w-auto">
          <nav>
            <ul className="flex flex-wrap justify-center gap-[50px] md:gap-4">
              <li className="flex justify-center flex-col items-center cursor-pointer">
                <Link className="ito" href="/">
                  <HomeIcon className="w-6 h-6 mx-auto" />
                
                  <p className="hidden md:flex">Inicio</p>
                </Link>
              </li>
              <li className="flex flex-col items-center cursor-pointer">
                <Link className="ito" href="#">
                  <UserGroupIcon className="w-6 h-6 mx-auto" />
                
                  <p className="hidden md:flex">Nosotros</p>
                </Link>
              </li>
              <li className="flex flex-col items-center cursor-pointer">
                <Link className="ito" href={`/demandas`}>
                  <BriefcaseIcon className="w-6 h-6 ito mx-auto" />
                
                  <p className="hidden md:flex">Demandas</p>
                </Link>
              </li>
              <li className="flex flex-col items-center cursor-pointer">
                <Link className="ito" href={`/contact`}>
                  <ChatBubbleBottomCenterTextIcon className="w-6 h-6 ito mx-auto" />
                  
                  <p className="hidden md:flex">Contacto</p>
                </Link>
              </li>
              <FloatingButton /> {/* Aquí se incluye el botón flotante */}
            </ul>
          </nav>
        </div>

        {/* Right Section (Session/Auth) */}
        <div className="header__right flex justify-center md:justify-end w-full md:w-auto">
          <nav>
            <ul className="flex gap-4">
              <li className="flex flex-col items-center">
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </li>
            </ul>
          </nav>
        </div>
      </div>

    </header>
  );
};
