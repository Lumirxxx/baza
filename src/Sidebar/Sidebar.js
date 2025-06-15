// Sidebar.js
import React from 'react';

const Sidebar = ({ 
  selectedSection, 
  onSelectSection, 
  wikis = [], 
  onSelectWiki,
  selectedWikiId 
}) => {
  return (
    <div className="sidebar">
      <div className='sidebar_header'>
        <div className='sidebar_heder_icon'>
          <div className='blure_circle'>
            <img className='union_circle' src='/Union.svg' alt="Union" />
          </div>
          <div className='small_circle'>
            <div className='small_circle-inside'></div>
          </div>
        </div>
        <div className="sidebar-title">Admin</div>
      </div>

      <div className='sidebar_title_menu'>MAIN MENU</div>
      <ul className='sidebar-menu'>
        {/* Пример других пунктов */}
        <li
          className={selectedSection === 'users' ? 'active' : ''}
          onClick={() => onSelectSection('users')}
        >
          <div className='sidebar-menu-content'>
            <div className='sidebar-menu-icon'>
              <img src='/user-edit.svg' alt="User Icon" />
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
              <img src='/document.svg' alt="News Icon" />
            </div>
            <div>Новости</div>
          </div>
        </li>

        {/* Пункт База знаний */}
        <li
          className={selectedSection === 'ipmwiki' ? 'active' : ''}
          onClick={() => {
            // Если уже выбрано 'ipmwiki', сбрасываем выбранную wiki
            if (selectedSection === 'ipmwiki') {
              onSelectWiki(null); // Сброс wikiId
            }
            onSelectSection('ipmwiki');
          }}
        >
          <div className='sidebar-menu-content'>
            <div className='sidebar-menu-icon'>
              <img src='/IPM_Wiki.svg' alt="Wiki Icon" />
            </div>
            <div>База знаний</div>
          </div>

          {/* Если выбран ipmwiki, отображаем подсписок wikis */}
          {selectedSection === 'ipmwiki' && wikis.length > 0 && (
            <ul className="sidebar-submenu">
              {wikis.map((wiki) => (
                <li
                  key={wiki.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Вызываем колбэк, передаём id выбранной вики
                    onSelectWiki && onSelectWiki(wiki.id);
                  }}
                  className={selectedWikiId === wiki.id ? 'active' : ''}
                >
                  {wiki.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
