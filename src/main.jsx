import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Package, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'
import './styles.css'

const COMPANY = {
  name: '郑州京溯网络科技有限公司',
  email: 'enjoylifegs@outlook.com',
  phone: '16555178421',
  address: '河南省郑州市郑东新区七里河南路永平路长通电商产业园三层535',
  registration: 'To be provided before launch'
}

const categories = [
  { id: 'earrings', name: 'Earrings', note: 'Light-catching everyday pairs' },
  { id: 'necklaces', name: 'Necklaces', note: 'Layer-ready wholesale staples' },
  { id: 'bracelets', name: 'Bracelets', note: 'Easy gifting silhouettes' },
  { id: 'rings', name: 'Rings', note: 'Simple shapes, broad appeal' },
  { id: 'hair', name: 'Hair Accessories', note: 'Soft finishing touches' }
]

const names = {
  earrings: ['Arc Studs', 'Pearl Drop Hoops', 'Leaf Huggies', 'Soft Oval Drops', 'Dawn Button Studs', 'Luna Threaders', 'Ribbon Hoops', 'Pebble Ear Cuffs', 'Petal Drops', 'Mini Halo Hoops'],
  necklaces: ['Fine Coin Chain', 'Moon Pendant', 'Layered Bar Chain', 'Oval Link Necklace', 'Pearl Line Necklace', 'Tiny Heart Chain', 'Ribbon Pendant', 'Bead Strand', 'Sun Disc Chain', 'Quiet Charm Necklace'],
  bracelets: ['Slim Cuff', 'Pearl Cord Bracelet', 'Oval Link Bracelet', 'Textured Bangle', 'Dainty Bead Chain', 'Soft Knot Bracelet', 'Twin Line Cuff', 'Round Charm Bracelet', 'Flat Snake Chain', 'Open Leaf Bangle'],
  rings: ['Stacking Band', 'Open Pearl Ring', 'Smooth Oval Ring', 'Twist Band', 'Tiny Stone Ring', 'Organic Wave Ring', 'Beaded Signet', 'Slim Dome Ring', 'Linked Ring', 'Petal Ring'],
  hair: ['Satin Bow Clip', 'Pearl Pin Set', 'Tortoise Claw Clip', 'Metal Wave Barrette', 'Velvet Knot Headband', 'Minimal Hair Pin', 'Soft Scrunchie', 'Twin Clip Set', 'Wide Resin Claw', 'Ribbon Hair Tie']
}

const priceByCategory = {
  earrings: [18, 32, 48],
  necklaces: [28, 58, 98],
  bracelets: [22, 46, 72],
  rings: [16, 38, 68],
  hair: [12, 24, 38]
}
const products = categories.flatMap((category) => names[category.id].map((name, index) => ({
  id: `${category.id}-${index + 1}`,
  category: category.id,
  categoryName: category.name,
  name,
  price: priceByCategory[category.id][index % 3],
  image: `/products/${category.id}-${index + 1}.webp`,
  color: ['gold', 'silver', 'rose'][index % 3],
  moq: index % 2 === 0 ? '10 pcs / style' : '20 pcs / style'
})))

const policyContent = {
  about: { title: 'About Us', body: 'Sparklyo is a wholesale catalog of unbranded women’s jewelry for boutiques, online sellers and retail buyers. We select easy-to-style everyday pieces to help small businesses build and replenish their collections. Product images and names are provided for catalog display.' },
  shipping: { title: 'Shipping Policy', body: 'Orders are prepared within 2–5 business days after confirmation. Transit time depends on destination, carrier service and customs clearance. For larger orders, our team will confirm packaging, quantity and shipping options before payment.' },
  tracking: { title: 'Order Tracking', body: 'After payment, order confirmation and shipping details will be sent to the email used at checkout. For tracking support, contact enjoylifegs@outlook.com with your order number.' },
  returns: { title: 'Payment, Returns & Refunds', body: 'The checkout includes PayPal, Visa and credit card options as a frontend demonstration. No live payment processor is connected yet. Contact us before fulfillment to request a cancellation. If goods arrive with a quantity error, visible damage or a mismatch with the confirmed order, contact us within 7 days with photos so we can arrange a replacement or refund.' },
  cancellation: { title: 'Cancellation Policy', body: 'You may request cancellation before an order enters fulfillment. Once an order has been handed to the carrier, cancellation follows the return process. Custom packaging or specially confirmed sourcing orders may follow the written terms agreed for that order.' },
  privacy: { title: 'Privacy Policy', body: 'We only use the name, email, phone number and address you provide for inquiries, demo orders and shipping communication. We do not sell personal information. Before live payment is connected, the operator should configure production-grade data storage and privacy controls.' },
  dmca: { title: 'DMCA', body: 'If you believe content on this site infringes your rights, email proof of ownership, the location of the material, your contact details and a good-faith statement to enjoylifegs@outlook.com. We will review and respond to valid notices.' }
}

const terms = ['Definitions & Scope', 'Supply & Product Information', 'Wholesale Minimums', 'Prices & Currency', 'Order Confirmation', 'Payment Methods', 'Shipping & Delivery', 'Customs & Duties', 'Inspection & Acceptance', 'Returns & Refunds', 'Order Cancellation', 'Intellectual Property', 'User Content', 'Limitation of Liability', 'Force Majeure', 'Changes to These Terms', 'Governing Law & Disputes']

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const routeFromHash = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'checkout' || hash === 'admin') return hash
    if (hash.startsWith('policy-')) return `policy:${hash.slice(7)}`
    return 'home'
  }
  const [route, setRoute] = useState(routeFromHash)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const visibleProducts = useMemo(() => products.filter((p) => (activeCategory === 'all' || p.category === activeCategory) && p.name.toLowerCase().includes(search.toLowerCase())), [activeCategory, search])
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const addToCart = (product, direct = false) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing ? current.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }]
    })
    if (direct) setRoute('checkout')
    else setCartOpen(true)
  }
  const updateQty = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter((item) => item.qty > 0))
  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])
  const go = (next) => {
    const hash = next === 'home' ? '' : next.replace('policy:', 'policy-')
    if (window.location.hash.replace('#', '') !== hash) window.location.hash = hash
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMenuOpen(false)
  }

  if (route === 'checkout') return <Checkout cart={cart} total={cartTotal} onBack={() => go('home')} onUpdate={updateQty} onEmpty={() => setCart([])} />
  if (route.startsWith('policy:')) return <PolicyPage type={route.slice(7)} onBack={() => go('home')} />
  if (route === 'admin') return <AdminPage onBack={() => go('home')} />

  return <>
    <div className="topline">WHOLESALE ONLY · Unit pricing from $10 · MOQ from 10 pcs / style · Volume quotes available</div>
    <header className="header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu"><Menu size={20} /></button>
      <button className="logo" onClick={() => go('home')}>sparklyo<span>•</span></button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <button onClick={() => { setActiveCategory('all'); go('home') }}>New arrivals</button>
        {categories.map((category) => <button key={category.id} onClick={() => { setActiveCategory(category.id); go('home') }}>{category.name}</button>)}
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search styles" /></label>
        <button className="icon-button" aria-label="favorites"><Heart size={20} /></button>
        <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
      </div>
    </header>
    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">B2B WHOLESALE CATALOG / 2026</p><h1>Stock your shop<br /><em>with ease.</em></h1><p className="hero-lead">Unbranded women's jewelry for boutiques, online sellers and retail buyers. Low MOQs, clear unit pricing and styles made for repeat orders.</p><button className="primary-button" onClick={() => { setActiveCategory('all'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse wholesale styles <ArrowRight size={17} /></button></div>
        <div className="hero-art"><img src="/products/hero.webp" alt="Unbranded gold hoop earrings and necklace" /><div className="hero-note"><Sparkles size={15} /> New season edit <span>01 / 05</span></div></div>
      </section>
      <section className="value-strip"><div><Truck size={21} /><span><strong>Wholesale ready</strong><small>MOQ from 10 pcs / style</small></span></div><div><ShieldCheck size={21} /><span><strong>Unbranded by design</strong><small>Clean, retail-ready goods</small></span></div><div><Package size={21} /><span><strong>Easy to reorder</strong><small>Built for growing shops</small></span></div></section>
      <section className="intro"><div><p className="eyebrow">BUILT FOR BUYERS</p><h2>Small MOQs.<br />Healthy margins.</h2></div><p>Order by style, not by case. Every listing shows a clear wholesale unit price and minimum order quantity, so you can test new styles before scaling your bestsellers.</p></section>
      <section className="buyer-steps"><div><span>01</span><strong>Choose styles</strong><small>Mix categories in one order.</small></div><div><span>02</span><strong>Meet the MOQ</strong><small>From 10 pcs per style.</small></div><div><span>03</span><strong>Request a quote</strong><small>Volume pricing for larger buys.</small></div></section>
      <section id="collection" className="collection"><div className="section-heading"><div><p className="eyebrow">WHOLESALE CATALOG</p><h2>Find your next bestsellers</h2></div><span>{visibleProducts.length} wholesale styles</span></div><div className="category-tabs"><button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All styles</button>{categories.map((category) => <button className={activeCategory === category.id ? 'active' : ''} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.name}</button>)}</div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>
      <section className="wholesale-banner"><div><p className="eyebrow">FOR RETAILERS & BUYERS</p><h2>Build a collection<br />that feels like you.</h2></div><p>Need a larger assortment or a custom quote? Tell us what you are building and our team will help you find the right mix.</p><a href={`mailto:${COMPANY.email}`}>Contact wholesale <ArrowRight size={16} /></a></section>
    </main>
    <Footer onNavigate={go} onAdmin={() => setShowAdmin(true)} />
    {cartOpen && <CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onUpdate={updateQty} onCheckout={() => { setCartOpen(false); go('checkout') }} />}
    {showAdmin && <AdminLogin onClose={() => setShowAdmin(false)} onSuccess={() => { setShowAdmin(false); go('admin') }} />}
  </>
}

function ProductCard({ product, onAdd }) { return <article className="product-card"><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><button className="save" aria-label="save"><Heart size={17} /></button><span className="tag">MOQ · {product.moq}</span></div><div className="product-info"><div><p>{product.categoryName} · WHOLESALE</p><h3>{product.name}</h3><small className="unit-note">Wholesale unit price</small></div><strong>${product.price}<small>/ piece</small></strong></div><div className="tier-note">10–49 pcs · listed price &nbsp; <b>50+ pcs · request volume quote</b></div><div className="card-actions"><button onClick={() => onAdd(product)}>Add to Cart</button><button onClick={() => onAdd(product, true)}>Buy Now - ${product.price}</button></div></article> }
function CartDrawer({ cart, total, onClose, onUpdate, onCheckout }) { return <aside className="drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>{cart.reduce((s, i) => s + i.qty, 0)}</span></h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div>{cart.length === 0 ? <div className="empty"><ShoppingBag size={34} /><p>Your bag is ready for your next edit.</p></div> : <><div className="drawer-items">{cart.map((item) => <div className="drawer-item" key={item.id}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>${item.price} · {item.moq}</p><div className="qty"><button onClick={() => onUpdate(item.id, -1)}><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => onUpdate(item.id, 1)}><Plus size={13} /></button></div></div><strong>${item.price * item.qty}</strong></div>)}</div><div className="drawer-foot"><div><span>Wholesale subtotal</span><strong>${total.toFixed(2)}</strong></div><small>Shipping and final taxes are calculated after order confirmation.</small><button className="primary-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={17} /></button></div></>}</aside> }
function Checkout({ cart, total, onBack, onUpdate, onEmpty }) { const [method, setMethod] = useState('paypal'); const [submitted, setSubmitted] = useState(false); return <div className="checkout-page"><div className="checkout-head"><button className="logo" onClick={onBack}>sparklyo<span>•</span></button><button className="back-button" onClick={onBack}>← Continue shopping</button></div>{submitted ? <div className="success-card"><Check size={34} /><p className="eyebrow">DEMO ORDER RECEIVED</p><h1>Thanks for your wholesale order.</h1><p>Your payment handoff is represented in this frontend demo. Connect your live payment provider before accepting real orders.</p><button className="primary-button" onClick={onBack}>Back to shop <ArrowRight size={17} /></button></div> : <div className="checkout-grid"><section><p className="eyebrow">CHECKOUT</p><h1>Ready when you are.</h1><div className="checkout-card"><h2>Contact & delivery</h2><input placeholder="Business or full name" /><input placeholder="Email address" type="email" /><input placeholder="Shipping address" /><div className="two-input"><input placeholder="City" /><input placeholder="Country / region" /></div></div><div className="checkout-card"><h2>Payment method</h2><div className="payment-options">{[['paypal','PayPal'],['visa','Visa'],['card','Credit card']].map(([id, label]) => <button key={id} className={method === id ? 'payment-option selected' : 'payment-option'} onClick={() => setMethod(id)}><span className={`pay-icon ${id}`}>{id === 'paypal' ? 'P' : id === 'visa' ? 'VISA' : '▣'}</span>{label}<span className="radio">{method === id && <i />}</span></button>)}</div><p className="demo-note">Payment buttons are front-end placeholders until a real merchant account and server-side order flow are connected.</p></div></section><aside className="order-summary"><p className="eyebrow">ORDER SUMMARY</p><h2>{cart.reduce((s, i) => s + i.qty, 0)} styles</h2>{cart.length ? cart.map((item) => <div className="summary-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><small>{item.qty} × ${item.price}</small></div><b>${item.qty * item.price}</b></div>) : <p>Your bag is empty.</p>}<div className="summary-total"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><button className="primary-button" disabled={!cart.length} onClick={() => setSubmitted(true)}>Pay securely · ${total.toFixed(2)} <ArrowRight size={17} /></button><button className="text-button" onClick={onEmpty}>Clear demo order</button></aside></div>}</div> }
function PolicyPage({ type, onBack }) { const content = policyContent[type]; return <div className="policy-page"><div className="checkout-head"><button className="logo" onClick={onBack}>sparklyo<span>•</span></button><button className="back-button" onClick={onBack}>← Back to shop</button></div><article className="policy-content"><p className="eyebrow">SPARKLYO INFORMATION</p><h1>{content?.title || 'Terms of Service'}</h1>{content ? <p>{content.body}</p> : <><p>By using the Sparklyo website and wholesale catalog, you agree to the following terms. Review them before ordering and seek professional advice where appropriate.</p>{terms.map((term, index) => <section key={term}><h2>{index + 1}. {term}</h2><p>We will handle catalog display, order communication and service matters related to {term} in a clear and reasonable manner. Each order is governed by the confirmed quotation, quantity, lead time and written agreement.</p></section>)}</>}</article><Footer onNavigate={onBack} /></div> }
function Footer({ onNavigate, onAdmin }) { const goPolicy = (key) => onNavigate(`policy:${key}`); return <footer><div className="footer-main"><div className="footer-brand"><button className="logo" onClick={() => onNavigate('home')}>sparklyo<span>•</span></button><p>Simple pieces, thoughtfully sourced.<br />Wholesale jewelry for everyday retail.</p><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></div><div><h3>Shop</h3>{categories.map((c) => <button key={c.id} onClick={() => onNavigate('home')}>{c.name}</button>)}</div><div><h3>Help & policies</h3><button onClick={() => goPolicy('about')}>About Us</button><button onClick={() => goPolicy('shipping')}>Shipping Policy</button><button onClick={() => goPolicy('tracking')}>Order Tracking</button><button onClick={() => goPolicy('returns')}>Payment, Returns & Refunds</button><button onClick={() => goPolicy('cancellation')}>Cancellation Policy</button><button onClick={() => goPolicy('terms')}>Terms of Service</button><button onClick={() => goPolicy('privacy')}>Privacy Policy</button><button onClick={() => goPolicy('dmca')}>DMCA</button></div><div><h3>Company</h3><p>{COMPANY.name}</p><p>{COMPANY.address}</p><p>{COMPANY.phone}</p><button className="admin-link" onClick={onAdmin}>Wholesale admin</button></div></div><div className="footer-bottom"><span>© 2026 {COMPANY.name}</span><span>Unbranded goods · Frontend demo checkout</span><span>Registration no.: {COMPANY.registration}</span></div></footer> }
function AdminLogin({ onClose, onSuccess }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const submit = (e) => { e.preventDefault(); if (email === 'admin@sparklyo.com' && password === 'Sparklyo2026!') onSuccess(); else setError('Incorrect email or password. Use the demo credentials shown below.'); }; return <div className="modal-backdrop"><form className="admin-modal" onSubmit={submit}><button type="button" className="close-modal" onClick={onClose}><X size={19} /></button><p className="eyebrow">WHOLESALE ADMIN</p><h2>Manage your catalog</h2><p className="modal-copy">Demo dashboard for products, orders and wholesale inquiries.</p><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />{error && <div className="error">{error}</div>}<button className="primary-button" type="submit">Sign in <ArrowRight size={16} /></button><small>Demo credentials: admin@sparklyo.com / Sparklyo2026!</small></form></div> }
function AdminPage({ onBack }) { return <div className="admin-page"><div className="checkout-head"><button className="logo" onClick={onBack}>sparklyo<span>•</span></button><button className="back-button" onClick={onBack}>← Back to shop</button></div><div className="admin-shell"><div><p className="eyebrow">WHOLESALE ADMIN</p><h1>Good morning, Sparklyo.</h1><p>Frontend demo dashboard. Connect your database and payment provider for production use.</p></div><div className="admin-stats"><div><span>Active styles</span><strong>50</strong></div><div><span>Demo orders</span><strong>12</strong></div><div><span>Pending quotes</span><strong>08</strong></div></div><div className="admin-table"><h2>Recent wholesale orders</h2>{['SPK-2048 · Moon Pendant · $560', 'SPK-2047 · Arc Studs · $320', 'SPK-2046 · Slim Cuff · $480'].map((row) => <div key={row}><span>{row}</span><b>Processing</b></div>)}</div></div></div> }

createRoot(document.getElementById('root')).render(<App />)
