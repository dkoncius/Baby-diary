
export const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKidData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };