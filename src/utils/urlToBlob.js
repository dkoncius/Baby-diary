export const urlToBlob = async (url) => {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
  
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching image:', error.message); // Log the error message
      return null;
    }
  };