export const cacheWithExpiry = (key, data, expiryTime) => {
  const now = new Date();

  const item = {
    value: data,
    expiry: now.getTime() + expiryTime,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log('Local Storage Full')
  }
};

export const retrieveCache = (key) => {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null
    }
    return item.value
};

export const clearCache = (key) => {
    localStorage.removeItem(key);
};

export const generateGoogleMapsLink = (latitude, longitude) => {
  const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return link;
};

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export const getCurrentDateTimeString = () => {
  var today = new Date();
  var date = today.getDate().toString().padStart(2, '0');
  var month = (today.getMonth() + 1).toString().padStart(2, '0');
  var year = today.getFullYear();
  var hours = today.getHours().toString().padStart(2, '0');
  var minutes = today.getMinutes().toString().padStart(2, '0');
  
  var dateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
  return dateTime;
};
