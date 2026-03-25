import { useMemo, useState } from 'react'
import Header from './components/Header'
import { rugs } from './data'
import { getTelegramUser, isAdmin } from './lib/telegram'

export default function App() {
  const user = getTelegramUser()
  const admin = isAdmin(user)
  const [selectedId, setSelectedId] = useState(rugs[0].id)
  const [selectedImage, setSelectedImage] = useState(rugs[0].images[0])
  const [selectedSize, setSelectedSize] = useState(rugs[0].dimensions[0])
  const [coverMode, setCoverMode] = useState<'full' | 'center'>('center')
  const [roomWidth, setRoomWidth] = useState('5.5')
  const [roomHeight, setRoomHeight] = useState('3.5')
  const [roomFile, setRoomFile] = useState<string | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(false)

  const selected = useMemo(() => rugs.find((r) => r.id === selectedId) ?? rugs[0], [selectedId])

  const overlayStyle = coverMode === 'full'
    ? { inset: '8% 6% 8% 6%' }
    : { width: '54%', height: '54%', left: '23%', top: '24%' }

  async function handleOrder() {
    try {
      setLoadingOrder(true)
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          productName: selected.title,
          size: selectedSize,
          price: `${selected.price.toLocaleString('en-US')} so'm`,
          note: `Rejim: ${coverMode === 'full' ? 'To‘liq qoplash' : 'O‘rtaga'}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Buyurtma yuborilmadi')
      alert('Buyurtma yuborildi ✅')
    } catch (e: any) {
      alert(`Xatolik: ${e.message || 'Buyurtma yuborilmadi'}`)
    } finally {
      setLoadingOrder(false)
    }
  }

  return (
    <div className="page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="shell">
        <Header user={user} />

        <main className="panel-layout">
          <aside className="panel side-left">
            <div className="pill-row">
              <button className="pill active">{selected.category}</button>
              <button className="pill">Vintage</button>
            </div>

            <h2 className="product-title">{selected.title}</h2>
            <p className="meta-line">SKU - {selected.code}</p>
            <p className="meta-line">{selectedSize} cm</p>

            <div className="side-preview-card">
              <img src={selectedImage} alt={selected.title} />
            </div>

            <div className="side-summary">
              <span className="summary-name">{selected.category}</span>
              <span className="summary-size">{selectedSize} cm</span>
            </div>

            <div className="price-block">{selected.price.toLocaleString('en-US')} so'm</div>
            <p className="desc">{selected.description}</p>

            <div className="feature-list">
              {selected.features.map((f) => (
                <div key={f} className="feature-pill">{f}</div>
              ))}
            </div>

            <div className="tiny-ribbon" />
          </aside>

          <section className="panel center-panel">
            <div className="toolbar">
              <div className="arrow-btn">‹‹</div>
              <div className="size-tabs">
                {selected.dimensions.map((d) => (
                  <button
                    key={d}
                    className={`tab ${selectedSize === d ? 'active' : ''}`}
                    onClick={() => setSelectedSize(d)}
                  >
                    {d.replace(' × ', 'x')}
                  </button>
                ))}
              </div>
              <div className="arrow-btn">››</div>
            </div>

            <div className="hero-image-wrap">
              <img src={selectedImage} alt={selected.title} className="hero-image" />
              <button className="hero-nav left">‹</button>
              <button className="hero-nav right">›</button>
            </div>

            <div className="thumb-row">
              {selected.images.map((img) => (
                <button
                  key={img}
                  className={`thumb ${selectedImage === img ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt="preview" />
                </button>
              ))}
            </div>

            <div className="center-copy">
              <h3>Ko‘rish va tanlash</h3>
              <p>Galereyadan gilamning 4–5 xil ko‘rinishini tanlang, yirik preview’da kuzating va buyurtma bering.</p>
            </div>

            <div className="bottom-actions">
              <button className="ghost-action">Savatchaga</button>
              <button className="gold-action" onClick={handleOrder} disabled={loadingOrder}>
                {loadingOrder ? 'Yuborilmoqda...' : 'Buyurtma'}
              </button>
            </div>
          </section>

          <aside className="panel side-right">
            <div className="size-tabs right-top-tabs">
              <button className="tab active">2x3m</button>
              <button className="tab">2.5x3.5m</button>
              <button className="tab">3x4m</button>
            </div>

            <div className="mode-row">
              <button className={`mode-btn ${coverMode === 'full' ? 'active' : ''}`} onClick={() => setCoverMode('full')}>To‘liq qoplash</button>
              <button className={`mode-btn ${coverMode === 'center' ? 'active' : ''}`} onClick={() => setCoverMode('center')}>O‘rtaga</button>
            </div>

            <div className="room-preview">
              <img src={roomFile || '/ui/room.svg'} alt="Xona preview" className="room-image" />
              <div className="rug-overlay" style={overlayStyle as any}>
                <img src={selectedImage} alt="Gilam overlay" />
              </div>
            </div>

            <div className="dimension-row">
              <div className="dimension-box">
                <span>Xona eni</span>
                <input value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} />
              </div>
              <div className="dimension-box">
                <span>Xona bo‘yi</span>
                <input value={roomHeight} onChange={(e) => setRoomHeight(e.target.value)} />
              </div>
            </div>

            <label className="upload-box">
              <span>Xona suratini yuklash</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = URL.createObjectURL(file)
                  setRoomFile(url)
                }}
              />
            </label>

            {admin && <div className="admin-badge">Admin panel faqat sizga ko‘rinadi</div>}
          </aside>
        </main>
      </div>
    </div>
  )
}
