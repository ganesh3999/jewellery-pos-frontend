import { useState, useEffect } from "react";
import "./App.css"; // We'll add some styles

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", weight: "", purity: "", price: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://jewellery-pos.onrender.com/products");
      const data = await res.json();   
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:4000/products";
      let method = "POST";

      if (editingId) {
        url += `/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEditingId(null);
        setForm({ name: "", weight: "", purity: "", price: "" });
        fetchProducts();
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting form");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      weight: product.weight,
      purity: product.purity,
      price: product.price,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchProducts();
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting product");
    }
  };

  return (
    <div className="container">
      <h1>Jewellery POS</h1>

      <div className="form-container">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} />
          <input name="purity" placeholder="Purity" value={form.purity} onChange={handleChange} />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
        </form>
        <p className="message">{message}</p>
      </div>

      <div className="table-container">
        <h2>Products List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight (g)</th>
              <th>Purity</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.weight}</td>
                <td>{p.purity}</td>
                <td>{p.price}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
