import WorldIcon from "../world-icon";
import logotipo from "@public/image/logotipo.png";

import "./map-loading-holder.css"

const MapLoadingHolder = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      {/* <WorldIcon className="icon" /> */}
      <img src={logotipo.src} alt="" />
      <h1>Inicializando el mapa</h1>
      <div className="icon-attribute">
        Desarrollado por {" "}
        <a href="https://msi.gob.pe/portal/">
          Stalin Huallullo
        </a>
      </div>
    </div >
  );
}

export default MapLoadingHolder;