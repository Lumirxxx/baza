import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('news');

  const renderSection = () => {
    switch (selectedSection) {
      case 'users':
        return <div>Пользователи</div>;
      case 'news':
        return <AddNews />;
      case 'ipmwiki':
        return <div>IPM Wiki</div>;
      default:
        return <div>Новости</div>;
    }
  };

  return (
    <div className="admin-page">
      <Sidebar selectedSection={selectedSection} onSelectSection={setSelectedSection} />
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
