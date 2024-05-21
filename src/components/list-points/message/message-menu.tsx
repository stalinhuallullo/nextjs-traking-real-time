import React from 'react'
import "./message-menu.css"
import MSI_LOGOTIPO from "@public/image/msi-logo.jpg"


const MessageNenu = () => {
    return (
        <div className='submenu'>
            <div className="submenu-header">
                <div className="title">
                    <h2>Mensaje</h2>
                    <button className="title-close"></button>
                </div>
            </div>
            <div className="submenu-body">
                <img src={MSI_LOGOTIPO.src} alt="" />
                <h3>Información</h3>
                <aside>desde 21 mayo 2024 hasta el 21 mayo 2024</aside>
                {/* <div className="msgItem-resources"></div> */}
                <p>
                    BUSES EN CIRCULACIÓN
                    <br />Estimados usuarios del Expreso San Isidro el día de hoy, Mar. 21 de mayo. Estarán operando los siguientes buses:
                    <br />🚌 RUTA 1: bus A y B
                    <br />🚌 RUTA 2: bus A
                    <br />🚌 RUTA 3: bus A Y B (El bus 3B iniciará su recorrido a las 7:00 am)
                </p>
            </div>
        </div>
    )
}

export default MessageNenu
