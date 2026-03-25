import { TelegramUser } from '../lib/telegram'

type Props = {
  user: TelegramUser | null
}

export default function Header({ user }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <img src="/ui/logo.svg" alt="Sanat Hali" className="brand-logo" />
        <div>
          <h1>Sanat Hali</h1>
          <p>Premium Gilam Showroom</p>
        </div>
      </div>

      <div className="top-actions">
        <button className="mini-btn active">UZ</button>
        <button className="mini-btn">Light</button>
        <button className="mini-btn">Kanal</button>
        <button className="cta-mini">Buyurtma</button>
        <div className="user-chip">
          <span className="avatar">{user?.first_name?.[0] || 'G'}</span>
          <div>
            <strong>{user?.first_name || 'Guest'}</strong>
            <small>{user ? 'Telegram bilan bog‘langan' : 'Telegramdan tashqarida test rejim'}</small>
          </div>
        </div>
      </div>
    </header>
  )
}
