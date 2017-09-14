import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import InvoiceForm from "./InvoiceForm";
import store from "./store";

ReactDOM.render(
     <Provider store={store}>
         <div style={{ padding: 15 }}>
            <header className="w3-container w3-teal">
               <h1>Invoice System</h1>
            </header>
            <InvoiceForm />
         </div>
     </Provider>,
     document.getElementById('root')
);
