import React from "react";
import { useLocation } from "react-router-dom";

const LookerView = () => {
  const location = useLocation();
  const url = location?.state?.url || "";

  return (
    <div>
      <iframe
        width="100%"
        height="100%"
        src="https://lookerstudio.google.com/embed/reporting/32f2f881-ab02-4485-8459-0db54e1afcaf/page/tEnnC"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};

export default LookerView;
