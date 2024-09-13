//Frontend
import React from 'react';
import { render } from 'react-dom';
import Menu from './Menu';
import Cart from './Cart';
import Checkout from './Checkout';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuItems: [],
      cartItems: [],
      total: 0
    };
  }

  componentDidMount() {
    fetch('/menu-items')
      .then(response => response.json())
      .then(data => this.setState({ menuItems: data }));
  }

  handleAddToCart = item => {
    const { cartItems } = this.state;
    const existingItem = cartItems.find(i => i.id === item.id);
    if (existingItem) {
      this.setState({
        cartItems: cartItems.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      });
    } else {
      this.setState({ cartItems: [...cartItems, { ...item, quantity: 1 }] });
    }
  };

  handleRemoveFromCart = item => {
    const { cartItems } = this.state;
    const existingItem = cartItems.find(i => i.id === item.id);
    if (existingItem.quantity === 1) {
      this.setState({ cartItems: cartItems.filter(i => i.id !== item.id) });
    } else {
      this.setState({
        cartItems: cartItems.map(i => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
      });
    }
  };

  handleCheckout = () => {
    const { cartItems } = this.state;
    fetch('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItems)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ total: data.total });
      });
  };

  render() {
    const { menuItems, cartItems, total } = this.state;
    return (
      <div className="container">
        <h1>Coffee Shop POS</h1>
        <Menu items={menuItems} onAddToCart={this.handleAddToCart} />
        <Cart items={cartItems} onRemoveFromCart={this.handleRemoveFromCart} />
        <Checkout onClick={this.handleCheckout} total={total} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
