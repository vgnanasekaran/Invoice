import React from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import Request from 'axios';

const computeTotal = (fields) => {
     let tot = 0.0;
     for (let i = 0; i < fields.length; i++) {
          tot=tot + fields.get(i).amount;
     }
     return parseFloat(tot).toFixed(2);
}


const renderField = ({ input, label, type, className, style, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} className={className} style={style} placeholder={label}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)
const renderInvoiceLineItem = ({ fields }) => {
     console.log('fields - ', fields);
     if (fields.length === 0) {
          fields.push({description: '', unit_price: 0.00, qty:0.00, amount: 0.00});
     }
     return (
          <div>
             <table className="w3-table w3-card-4">
                <thead>
                  <tr className="w3-teal">
                     <th style={{"textAlign": "left"}}>Description</th>
                     <th style={{"textAlign": "left"}}>Qty</th>
                     <th style={{"textAlign": "left"}}>price  </th>
                     <th style={{"textAlign": "left"}}>Amount</th>
                     <th/>
                  </tr>
                </thead>
                <tbody>
                  {
                    fields.map((item, index) =>
                    <tr key={index}>
                      <td>
                         <input name={`${item}.description`} className="w3-input" onChange={() => {
                                    const current = fields.get(index);
                                    console.log('current :', current);
                                    const desc = document.getElementById(`${item}.description`).value;
                                    current.description = desc;
                                    current.currency = 'USD'
                                    fields.remove(index);
                                    fields.insert(index, current);
                                    console.log('current after change :', current); }}
                                    type="text" id={`${item}.description`} required/>
                      </td>
                      <td>
                         <input name={`${item}.qty`} className="w3-input" id={`${item}.qty`} onChange={() => {
                                    const current = fields.get(index);
                                    console.log('current :', current);
                                    const qty = document.getElementById(`${item}.qty`).value;
                                    current.qty = qty;
                                    current.amount = qty * current.unit_price;
                                    document.getElementById(`${item}.amount`).value = parseFloat(current.amount).toFixed(2);
                                    fields.remove(index);
                                    fields.insert(index, current);
                                    console.log('current after change :', current);
                                    document.getElementById('total').value=computeTotal(fields);
                              }}  type="number"  required/>
                      </td>
                      <td>
                         <input name={`${item}.unit_price`} className="w3-input" id={`${item}.unit_price`} onChange={() => {
                              const current = fields.get(index);
                              console.log('current :', current);
                              const price = document.getElementById(`${item}.unit_price`).value;
                              current.unit_price = price;
                              current.amount = current.qty * price;
                              document.getElementById(`${item}.amount`).value = parseFloat(current.amount).toFixed(2);
                              fields.remove(index);
                              fields.insert(index, current);
                              console.log('current after change :', current);
                              document.getElementById('total').value=computeTotal(fields);
                         }} type="number" value={item.unit_price} required/>
                      </td>
                      <td>
                         <input name={`${item}.amount`} className="w3-input" id={`${item}.amount`} type="text" value={item.amount} readOnly/>
                      </td>
                      { index === fields.length -1 &&
                         <td>
                            <button type="button" className="w3-button w3-circle w3-teal" onClick={() => fields.push({})}>+</button>
                         </td>
                      }
                      { index !== fields.length -1 &&
                         <td>
                            <button type="button" className="w3-button w3-circle w3-teal" onClick={() => fields.remove(index)}>-</button>
                         </td>
                      }
                      {console.log('item', item)}
                   </tr>
                  )}
                  <tr>
                     <td/>
                     <td/>
                     <td>
                     <input name="total" className="w3-input w3-border-0"  type="text" value='Total: $'readOnly/>
                     </td>
                     <td>
                         <input name="total" className="w3-input" id="total" type="text" readOnly/>
                     </td>
                     <td/>
                  </tr>
                </tbody>
             </table>
          </div>);
}

const onSubmit = (values, dispatch, props) => {
	console.log('values in onSubmit');
	console.log(values);
     console.log('props onSubmit : ', props);

     const invoiceData = {
     	"invoice" : {
     		"customer": {
     			"name": values.name,
     			"email": values.email,
     		},
     		"due_date": values.due_date,
     		"line_items":  values.invoice_detail
     	}
     }
     console.log('api request invoice_data', invoiceData)

     Request.post('http://localhost:3001/api/invoice', invoiceData)
     .then((response) => {
          console.log('response ', response);
     })
     .catch((error) => {
          console.log('Error From Api Call: ', error.response);
     });
}

const InvoiceForm = (props) => {
       const { handleSubmit} = props
       return (
          <div className="w3-container w3-half w3-margin-top">
            <form className="w3-container" onSubmit={handleSubmit(onSubmit)}>
              <label>Name</label>
              <Field name="name"  className="w3-input" type="text" component={renderField} style={{"width": '75%'}} required/>
              <label>Email</label>
              <Field name="email" className="w3-input" type="text" component={renderField} style={{"width": '75%'}} required/>
              <label>Due Date</label>
              <Field name="due_date" className="w3-input" type="date" component={renderField} style={{"width": '40%'}} required/>
              <br/>
              <FieldArray name="invoice_detail" component={renderInvoiceLineItem} />
              <br/>
              <button type="submit" className="w3-button w3-teal w3-right w3-round"> send </button>
            </form>
          </div>
       );
}

export default reduxForm({
  form: 'invoice', // a unique identifier for this form
})(InvoiceForm);
