export const useInputChange = (initialState) => {
    const [values, setValues] = useState(initialState);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    };
  
    return [values, handleInputChange];
};
  