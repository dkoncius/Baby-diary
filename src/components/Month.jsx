export const Month = ({ index, imageUrl, onClick }) => (
    <div className="month-box" onClick={() => onClick(index)} role="listitem">
      {imageUrl ? (
        <img src={imageUrl} alt={`Month ${index + 1}`} />
      ) : (
        <i className="fa-solid fa-plus" aria-hidden="true"></i>
      )}
      <p className='month'>{index + 1} mėnuo</p>
    </div>
);
