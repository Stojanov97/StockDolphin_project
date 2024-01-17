import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkDB } from "../../../Slices/CheckForDBUpdatesSlice";
import { useNavigate, useParams } from "react-router-dom";
import Currency from "react-currency-formatter";
import "../Inventory.css";
import AddIcon from "../../../Images/Add.png";
import SortIcon from "../../../Images/Sort.png";
import AddOrderPopUp from "../../../Components/PopUps/Order/Add";
import AddInvoicePopUp from "../../../Components/PopUps/Invoice/Add";
import EditItem from "../../../Components/PopUps/Item/Edit";

const OrderInventory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(checkDB());
  }, []);
  const items = useSelector((state) => state.items.value);
  const allOrders = useSelector((state) => state.orders.value);
  const invoices = useSelector((state) => state.invoices.value).filter(
    (invoice) => invoice.item.id === id
  );
  const invoicesTotal = invoices.reduce((acc, curr) => acc + curr.total, 0);
  let orders = allOrders.filter((order) => order.item.id === id);
  let item = items.find((item) => item._id === id);
  let admin = useSelector((state) => state.decodedToken.value.admin);
  const [addStat, setAddStat] = useState(false);
  const [invoice, setInvoice] = useState(false);
  const [sort, setSort] = useState(false);
  const close = () => {
    setAddStat(false);
  };

  return (
    <section>
      {addStat && <AddOrderPopUp close={close} item={item} />}
      {invoice && (
        <AddInvoicePopUp
          close={() => setInvoice(false)}
          item={item}
          orders={orders}
        />
      )}
      <div className="breadcrumb">
        <h1>
          <span
            onClick={() => {
              navigate("/inventory");
            }}
          >
            Inventory
          </span>
          <span
            onClick={() => {
              navigate(`/inventory/${item.category.id}`);
            }}
          >
            {item && ` > ${item.category.name}`}{" "}
          </span>
          <span
            onClick={() => {
              window.location.reload(false);
            }}
          >
            {item && `> ${item.name}`}{" "}
          </span>
        </h1>
      </div>
      <hr />

      <div id="item-workspace">
        <div id="topBtns">
          <div id="info">
            <div>
              Total Orders: <b>{orders.length}</b>
            </div>

            <div>
              Total Cost:{" "}
              <b>
                {" "}
                <Currency
                  quantity={invoicesTotal}
                  currency="EUR"
                  pattern="! ###,##0.00"
                />
              </b>
            </div>
            <div>
              Total Invoices: <b>{invoices.length}</b>
            </div>
          </div>
          {admin && (
            <button
              className="interaction-btn"
              onClick={() => {
                setAddStat(true);
              }}
            >
              <div className="btn-bg square-bg">
                <img src={AddIcon} alt="" />
              </div>
              <span className="btn-text">ADD ORDER</span>
            </button>
          )}
        </div>
        <div id="itemWorkspaceDivider">
          <div>
            <div className="breadcrumb">
              <h1>Orders</h1>
              {admin && (
                <div
                  className="interaction-btn"
                  id="invoiceBtn"
                  onClick={() => setInvoice(true)}
                >
                  Generate Invoice
                </div>
              )}
            </div>
            <hr />
            <div id="orderTableContainer">
              {orders.sort((a, b) => {
                if (!sort) {
                  return b.price - a.price;
                }
                return a.price - b.price;
              }).length > 0 ? (
                <>
                  <img
                    src={SortIcon}
                    alt=""
                    className="sort-btn"
                    onClick={() => {
                      setSort((curr) => !curr);
                    }}
                  />
                  <table id="orderTable">
                    <thead>
                      <tr>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Price per unit</th>
                        <th>Ordered At</th>
                        <th>Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            {order.quantity} unit{order.quantity > 1 && "s"}
                          </td>
                          <td>
                            <Currency
                              quantity={order.price}
                              currency="EUR"
                              pattern="! ###,##0.00"
                            />
                          </td>
                          <td>
                            <Currency
                              quantity={order.price / order.quantity}
                              pattern="! ###,##0.00"
                              currency="EUR"
                            />
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.supplier.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="na middle-na">No orders found</p>
              )}
            </div>
          </div>
          <EditItem id={id} />
        </div>
      </div>
    </section>
  );
};

export default OrderInventory;
