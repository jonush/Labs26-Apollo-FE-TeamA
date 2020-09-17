import React, { useContext, useState } from "react";
import { RequestsContext } from "../../state/contexts/RequestsContext";
import axios from "axios";
const Requests = () => {
  const { requestsList } = useContext(RequestsContext);

  return (
    <>
      {requestsList.map(item => (
        <div>
          <h3>{item.created_at}</h3>
        </div>
      ))}
    </>
  );
};

export default Requests;
