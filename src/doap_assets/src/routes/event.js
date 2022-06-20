import React, { Fragment, useState } from 'react';

import { useParams } from "react-router-dom";
import { getInvoice } from "../data";

export default function Event() {
  let params = useParams();
  let invoice = getInvoice(parseInt(params.eventId, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
    </main>
  );
}
