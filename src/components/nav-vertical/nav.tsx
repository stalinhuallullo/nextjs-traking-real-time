"use client"
import "./nav-vertical.css";
import icon_logout from '@public/icons/icon_logout.png'
import { MENU } from "./menu";
import ItemMenu from "./item";
import ListWhereAbout from "../list-points/whereabout/list-whereabout";
import ListRoutes from "../list-points/routes/list-route";
import { UIContext } from '@/context/ui';
import { useContext, useEffect, useMemo } from "react";
import MessageNenu from "../list-points/message/message-menu";

const NavVertical = () => {
    const { isMenu } = useContext(UIContext);

    const viewResultMenu = useMemo(() => {
        
        if (isMenu === "BELL") return <MessageNenu />
        else if (isMenu === "RUTE") return <ListRoutes />
        else if (isMenu === "WHEREABOUT") return <ListWhereAbout />
        else return <></>
    }, [isMenu]);

    // const viewResultMenu = () => {
    //     if (isMenu === "RUTE") return <ListRoutes />
    //     else if (isMenu === "WHEREABOUT") return <ListWhereAbout />
    //     else return <></>
    // }

    // useEffect(() => {
    //     viewResultMenu()
    // }, [isMenu])

    return (
        <>
            <section className="hiddenByTransition main-menu">
                <div className="menu-header">
                    <div className="msi-logo"></div>
                    <button className="menu-close" id="closeMenuButton"></button>
                </div>
                <ul className="menu-content">
                    {
                        MENU.map((item, index) => {
                            return (
                                <ItemMenu item={item} key={index} />
                            )
                        })
                    }
                </ul>
                <ul className="menu-network">
                    {/* <li className="menu-item big-item">
                        <div className="menu-item-link-icon">
                            <img id="icon" src={icon_logo.src} />
                        </div>
                        <div className="menu-network-name">
                            <span id="menuAboutButtonSpan">La red seleccionada es</span>
                            <span id="menuAboutButtonSubtitle">Expreso San Isidro</span>
                        </div>
                    </li> */}
                    <li className="menu-item exit-item">
                        <a href="#" className="menu-item-link">
                            <div className="menu-item-link-icon">
                                <img src={icon_logout.src} alt="" />
                            </div>
                            <span className="menu-item-link-text" title="Changer de réseau">Salir</span>
                        </a>
                    </li>
                </ul>
            </section>

            {viewResultMenu}
            {/* <ListWhereAbout />
            <ListRoutes /> */}

        </>
    )
}
export default NavVertical