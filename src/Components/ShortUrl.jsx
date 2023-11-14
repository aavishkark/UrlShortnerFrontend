import React, { useState } from 'react';
import axios from 'axios';

const ShortUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [expirationTime, setExpirationTime] = useState(0);
  const [shortUrl, setShortUrl] = useState('');
  const [shortID, setShortID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://kind-gray-elk-sari.cyclic.app/shorten',
        {
          originalUrl: originalUrl,
          customUrl: customUrl,
          expirationTime: expirationTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setShortUrl(response.data.shortUrl);
      setShortID(response.data.shortid)
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while processing your request.');
      }
      setShortUrl('');
    }
  };

  const handleUrl = async (e) => {
    e.preventDefault();
    console.log(shortID)
    try {
     await axios.get(`https://kind-gray-elk-sari.cyclic.app/geturl/${shortID}`)
      .then(res=>{
        window.open(res.data.url)
      })
      .catch(err=>{
        console.log(err)
      })
    } catch (err) {
      setError('Error redirecting to the original URL.');
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Original URL:
          <input type="text" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} required />
        </label>
        <br />
        <label>
          Custom URL:
          <input type="text" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} />
        </label>
        <br />
        <label>
          Expires in:
          <input type="number" value={expirationTime} onChange={(e) => setExpirationTime(e.target.value)} />
        </label>
        <br />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <p onClick={handleUrl} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            {shortUrl}
          </p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ShortUrl;
