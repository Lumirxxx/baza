import React from 'react';

const UserSearch = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Найти по логину..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default UserSearch;
