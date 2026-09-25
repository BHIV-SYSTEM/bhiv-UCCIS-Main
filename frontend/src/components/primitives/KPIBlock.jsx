const KPIBlock = ({
  label,
  value
}) => {

  return (

    <div className="kpi-block">

      <h3>
        {label}
      </h3>

      <h2>
        {value}
      </h2>

    </div>

  );

};

export default KPIBlock;