import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from '@fluentui/react-northstar';

export default function Feedback() {
  const history = useHistory();

  let handleSubmit = async (e) => {
      history.push("/");
  }
  return (
    <div>
    <div>
      Request for payment has been sent!
    </div>
    <Button content="Done" onClick={handleSubmit} />
    </div>
  );
}