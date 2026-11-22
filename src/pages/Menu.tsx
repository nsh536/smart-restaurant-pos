
import { useState } from 'react'

type FoodItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
}

type CartItem = FoodItem & {
  quantity: number
}

type ConfirmedOrder = {
  token: number
  items: CartItem[]
  total: number
  paymentMethod: string
  date: string
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: 220,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600',
  },
  {
    id: 2,
    name: 'Veg Biryani',
    category: 'Biryani',
    price: 160,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600',
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 249,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
  },
  {
    id: 4,
    name: 'Chicken Burger',
    category: 'Burgers',
    price: 149,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  },
]

const categories = ['All', 'Biryani', 'Pizza', 'Burgers']

function getDailyToken(): number {
  const today = new Date().toLocaleDateString('en-CA')
  const storageKey = `smart-pos-token-${today}`

  const lastToken = Number(localStorage.getItem(storageKey) || '0')
  const nextToken = lastToken + 1

  localStorage.setItem(storageKey, String(nextToken))

  return nextToken
}

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [confirmedOrder, setConfirmedOrder] =
    useState<ConfirmedOrder | null>(null)

  const [showPayment, setShowPayment] = useState(false)

  const filteredItems =
    selectedCategory === 'All'
      ? foodItems
      : foodItems.filter(
          (item) => item.category === selectedCategory
        )

  const addToCart = (item: FoodItem) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id
      )

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [...previousCart, { ...item, quantity: 1 }]
    })
  }

  const increaseQuantity = (id: number) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (id: number) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    )
  }

  const clearCart = () => {
    setCart([])
    setShowPayment(false)
  }

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Open payment section
  const proceedToPayment = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  // Demo payment simulation
  const completeDemoPayment = () => {
    if (cart.length === 0) return

    const token = getDailyToken()

    const order: ConfirmedOrder = {
      token,
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
      paymentMethod,
      date: new Date().toLocaleString(),
    }

    setConfirmedOrder(order)
    setCart([])
    setShowPayment(false)
  }

  const startNewOrder = () => {
    setConfirmedOrder(null)
    setCart([])
    setShowPayment(false)
    setSelectedCategory('All')
    setPaymentMethod('UPI')
  }

  // Payment confirmation screen
  if (confirmedOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-green-700">
            Payment Successful!
          </h1>

          <p className="mt-2 text-gray-500">
            Your order has been confirmed.
          </p>

          <div className="my-6 rounded-xl bg-orange-50 p-6">
            <p className="text-sm font-medium text-gray-500">
              YOUR TOKEN NUMBER
            </p>

            <p className="mt-2 text-6xl font-bold text-orange-600">
              {confirmedOrder.token}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-6">
            <p className="text-sm text-gray-500">
              COLLECT YOUR ORDER AT
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              COUNTER 1
            </p>
          </div>

          <div className="mt-6 space-y-3 text-left">
            {confirmedOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}

            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-orange-600">
                ₹{confirmedOrder.total}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Payment Method</span>
              <span>{confirmedOrder.paymentMethod}</span>
            </div>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Order time: {confirmedOrder.date}
          </p>

          <p className="mt-4 font-medium text-green-700">
            Please collect your food at Counter 1.
          </p>

          <button
            onClick={startNewOrder}
            className="mt-7 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Start New Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Restaurant Header */}
      <header className="bg-orange-600 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">
            Smart Restaurant
          </h1>
          <p className="mt-2">
            Explore our delicious menu
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Menu Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">
            Our Menu
          </h2>

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            🛒 Cart: <strong>{totalItems}</strong> items
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 font-medium transition ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-4">
                <p className="text-xs text-orange-600">
                  {item.category}
                </p>

                <h3 className="mt-1 font-semibold">
                  {item.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700"
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Your Cart
            </h2>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty. Add some delicious food!
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-8 w-8 rounded-full bg-gray-100 font-bold"
                      >
                        −
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="h-8 w-8 rounded-full bg-orange-100 font-bold text-orange-600"
                      >
                        +
                      </button>

                      <strong className="min-w-20 text-right">
                        ₹{item.price * item.quantity}
                      </strong>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-orange-600">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={proceedToPayment}
                className="mt-6 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </section>

        {/* Demo Payment Section */}
        {showPayment && (
          <section className="mt-8 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Payment
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select a demo payment method.
            </p>

            <div className="mt-5 space-y-3">
              {['UPI', 'Card'].map((method) => (
                <label
                  key={method}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 hover:bg-orange-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-orange-600"
                  />
                  <span className="font-medium">
                    {method}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Amount to Pay</span>
              <span className="text-orange-600">
                ₹{totalPrice}
              </span>
            </div>

            <button
              onClick={completeDemoPayment}
              className="mt-5 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              Simulate Successful Payment – ₹{totalPrice}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="mt-3 w-full rounded-xl bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200"
            >
              Back to Cart
            </button>

            <p className="mt-4 text-center text-xs text-amber-600">
              Demo only. No real payment is processed.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default Menu
