export const Month = ({ index, imageUrl, onClick }) => (
    <div className="month-box" onClick={() => onClick(index)}>
      {imageUrl ? (
        <img src={imageUrl} alt={`Month ${index + 1}`} />
      ) : (
        <i className="fa-solid fa-plus"></i> // Or any other placeholder you'd like
      )}
      <p className='month'>{index + 1} mėnuo</p>
    </div>
  );
  
