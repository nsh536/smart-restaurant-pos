function Home() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Smart Restaurant POS
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Restaurant Management System
        </p>
      </header>

      <main className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Menu Management</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage restaurant food items.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Orders</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage customer orders.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Billing</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage customer bills.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Home