
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

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600',
  },
  {
    id: 2,
    name: 'Veg Biryani',
    category: 'Biryani',
    price: 160,
    image:
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600',
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 249,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
  },
  {
    id: 4,
    name: 'Chicken Burger',
    category: 'Burgers',
    price: 149,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  },
]

const categories = ['All', 'Biryani', 'Pizza', 'Burgers']

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])

  // Filter food items by category
  const filteredItems =
    selectedCategory === 'All'
      ? foodItems
      : foodItems.filter(
          (item) => item.category === selectedCategory
        )

  // Add food item to cart
  const addToCart = (item: FoodItem) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id
      )

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        )
      }

      return [...previousCart, { ...item, quantity: 1 }]
    })
  }

  // Increase quantity
  const increaseQuantity = (id: number) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Decrease quantity
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

  // Remove individual item
  const removeFromCart = (id: number) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setCart([])
  }

  // Calculate total items
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

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
        {/* Menu Heading and Cart Count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">
            Our Menu
          </h2>

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            🛒 Cart:{' '}
            <strong>{totalItems}</strong> items
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
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
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
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="h-8 w-8 rounded-full bg-orange-100 font-bold text-orange-600 hover:bg-orange-200"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>

                      <strong className="min-w-20 text-right">
                        ₹{item.price * item.quantity}
                      </strong>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 flex items-center justify-between text-xl font-bold">
                <span>Total Amount</span>

                <span className="text-orange-600">
                  ₹{totalPrice}
                </span>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default Menu
