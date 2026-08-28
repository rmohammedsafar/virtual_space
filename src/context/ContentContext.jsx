import React, { createContext, useState, useEffect, useContext } from 'react';

export const ContentContext = createContext({});

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('http://3.110.191.121:5000/api/content');
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch CMS content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
