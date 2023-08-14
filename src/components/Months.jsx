


export const Months = () => {
  return (
    <>
    <div className="month-boxes">
      <h1>Months</h1>
        {Array(20).fill().map((_, i) => (
            <div key={i} className="month-box"></div>
        ))}
    </div>
    </>
  )
}
