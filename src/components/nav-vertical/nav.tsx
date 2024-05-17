import "./nav-vertical.css";

const NavVertical = () => {
    return (
        <>
            <section className="hiddenByTransition main-menu">
                <div className="menu-header">
                    <div className="msi-logo"></div>
                    <button className="menu-close" id="closeMenuButton"></button>
                </div>
                <ul className="menu-content">
                    <li className="menu-item menu-item-msg">
                        <a href="javascript://" id="menuMsgButton" className="menu-item-link">
                            <div className="menu-item-link-icon menu-item-link-icon__notification"></div>
                            <span className="menu-item-link-text" id="menuMsgButtonSpan">Mensaje</span>
                        </a>
                        <div id="menuNbMsgUnreadContainer" className="false-notif hidden">
                            <span id="menuNbMsgUnread" className="false-notif-text">0</span>
                        </div>
                    </li>
                </ul>
                <ul className="menu-network">
                    <li className="menu-item big-item">
                        <div className="menu-item-link-icon iconAbout">
                            <img id="icon" src="https://storage.googleapis.com/zoomzoomzenlive.appspot.com/SanIsidro.jpg" />
                        </div>
                        <div className="menu-network-name">
                            <span id="menuAboutButtonSpan">La red seleccionada es</span>
                            <span id="menuAboutButtonSubtitle">Expreso San Isidro</span>
                        </div>
                    </li>
                    <li className="menu-item exit-item">
                        <a href="javascript://" id="menuExitContainer" className="menu-item-link">
                            <div className="menu-item-link-icon"></div>
                            <span className="menu-item-link-text" id="menuExit" title="Changer de réseau">Dejar la red actual</span>
                        </a>
                    </li>
                </ul>
            </section>
        </>
    )
}
export default NavVertical