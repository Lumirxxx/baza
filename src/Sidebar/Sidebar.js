import React from 'react';
import markerIcon from '../icons/toggle2.svg';
const Sidebar = ({ selectedSection, onSelectSection }) => {
    return (
        <div className="sidebar">
            <div className='sidebar_header'>

                <div className='sidebar_heder_icon'>
                    <div className='blure_circle'>
                        <img className='union_circle' src='/Union.svg'></img>
                    </div>
                    <div className='small_circle'>
                        <div className='small_circle-inside'></div>
                    </div>
                </div>
                <div className="sidebar-title">Admin</div>
            </div>
            <div className='sidebar_title_menu' >MAIN MENU</div>
            <ul className='sidebar-menu'>
                <li
                    className={selectedSection === 'users' ? 'active' : ''}
                    onClick={() => onSelectSection('users')}
                >
                    <div className='sidebar-menu-content'>
                        <div className='sidebar-menu-icon'>
                            <img src='/user-edit.svg' alt="" />
                        </div>
                        <div>Пользователи</div>
                    </div>


                </li>
                <li
    className={selectedSection === 'contracts' ? 'active' : ''}
    onClick={() => onSelectSection('contracts')}
>
    <div className='sidebar-menu-content'>
        <div className='sidebar-menu-icon'>
            <img src='/document-download.svg' alt="Contracts Icon" />
        </div>
        <div>Документы</div>
    </div>
</li>
                <li
                    className={selectedSection === 'news' ? 'active' : ''}
                    onClick={() => onSelectSection('news')}
                >
                    <div className='sidebar-menu-content'>
                        <div className='sidebar-menu-icon'>
                            <img src='/document.svg' alt="" />
                        </div>
                        <div>Новости</div>
                    </div>
                </li>
                <li
                    className={selectedSection === 'ipmwiki' ? 'active' : ''}
                    onClick={() => onSelectSection('ipmwiki')}
                >
                    <div className='sidebar-menu-content'>
                        <div className='sidebar-menu-icon'>
                            <img src='/IPM_Wiki.svg' alt="" />
                        </div>
                        <div>IPM Wiki</div>
                    </div>

                </li>
            </ul>
        </div>
    );
};

export default Sidebar;