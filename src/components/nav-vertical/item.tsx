import React, { useContext } from 'react'
import { MENU, IItemMenu } from "./menu";
import { UIContext } from '@/context/ui';

interface Item {
    item: IItemMenu
}

const ItemMenu = ({ item }: Item) => {
    const { isMenu, toggleSideMenu } = useContext(UIContext);

    return (
        <li className="menu-item menu-item-msg">
            <a href="#" className={item.menu === isMenu ? "menu-item-link active" : "menu-item-link"} onClick={(e) => { e.preventDefault(); toggleSideMenu(item.menu); }}>
                <div className="menu-item-link-icon">
                    <img src={item.image} alt="" />
                </div>
                <span className="menu-item-link-text" id="menuMsgButtonSpan">{item.span}</span>
            </a>
        </li>
    )
}

export default ItemMenu
