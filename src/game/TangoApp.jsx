// @ts-nocheck
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import GameScene from './GameScene';

const SAVE_KEY = 'tangoworld-save-v1';
const MAX_OFFLINE_SECONDS = 12 * 60 * 60;

const SKINS = [
  { id: 'dog_star', name: 'Estrellita', price: 0, rarity: 'Inicial', desc: 'Tu compañero de aventuras, siempre listo para jugar.' },
  { id: 'dog_bubble', name: 'Burbujeante', price: 38, rarity: 'Común', desc: 'Una apariencia alegre, ligera y llena de burbujas.' },
  { id: 'dog_bard', name: 'Bardo', price: 52, rarity: 'Especial', desc: 'El músico oficial de las tardes de juego.' },
  { id: 'dog_cyborg', name: 'Cibermascota', price: 95, rarity: 'Épica', desc: 'Tecnología, luces y mucha actitud futurista.' },
  { id: 'dog_worker', name: 'Manos a la obra', price: 48, rarity: 'Común', desc: 'Siempre encuentra algo divertido que construir.' },
  { id: 'dog_mummy', name: 'Momimiau', price: 72, rarity: 'Especial', desc: 'Un misterio adorable salido de una antigua pirámide.' },
  { id: 'dog_boxer', name: 'Campeón', price: 66, rarity: 'Especial', desc: 'Entrenado para competir y celebrar cada victoria.' },
  { id: 'dog_flower', name: 'Florecita', price: 56, rarity: 'Común', desc: 'Una apariencia fresca que ilumina la habitación.' },
  { id: 'dog_mage', name: 'Pequeño mago', price: 88, rarity: 'Épica', desc: 'Un toque de magia para cada día.' },
  { id: 'dog_runner', name: 'Velocista', price: 62, rarity: 'Especial', desc: 'Rápido, juguetón y preparado para la carrera.' },
];

const ITEMS = [
  { id: 'kibble', name: 'Croquetas', icon: '🥣', category: 'Comida', price: 8, desc: 'Una comida equilibrada.', effects: { hunger: 26 }, use: 'Comer' },
  { id: 'apple', name: 'Manzana dulce', icon: '🍎', category: 'Comida', price: 7, desc: 'Un bocadito fresco y crujiente.', effects: { hunger: 17, fun: 4 }, use: 'Comer' },
  { id: 'treat', name: 'Galletita', icon: '🦴', category: 'Comida', price: 12, desc: 'Un premio rico y divertido.', effects: { hunger: 12, fun: 13 }, use: 'Comer' },
  { id: 'medkit', name: 'Botiquín', icon: '🩹', category: 'Cuidados', price: 18, desc: 'Ayuda a recuperar el bienestar.', effects: { health: 34 }, use: 'Usar' },
  { id: 'soap', name: 'Jabón suave', icon: '🫧', category: 'Cuidados', price: 7, desc: 'Para un baño reluciente.', effects: {}, use: 'Usar' },
  { id: 'tennis', name: 'Pelota saltarina', icon: '🎾', category: 'Juguetes', price: 13, desc: '¡Perfecta para entretenerse!', effects: { fun: 22 }, use: 'Jugar' },
];

const STAT_META = {
  hunger: { label: 'Hambre', icon: '🍎', color: 'coral', low: '¡Tengo hambre!' },
  sleep: { label: 'Sueño', icon: '🌙', color: 'lavender', low: 'Me vendría bien una siesta.' },
  health: { label: 'Salud', icon: '💗', color: 'mint', low: 'Necesito algunos cuidados.' },
  dirt: { label: 'Limpieza', icon: '🫧', color: 'blue', low: '¡Hora de un baño!' },
  fun: { label: 'Diversión', icon: '⭐', color: 'yellow', low: '¿Jugamos un ratito?' },
};

const INITIAL_GAME = {
  stats: { hunger: 78, sleep: 82, health: 94, dirt: 16, fun: 74 },
  coins: 45,
  inventory: { kibble: 3, apple: 1, treat: 0, medkit: 1, soap: 2, tennis: 1 },
  unlockedSkins: ['dog_star'],
  equippedSkin: 'dog_star',
  sleeping: false,
  lastUpdate: Date.now(),
  lastDailyBonus: '',
  lastCareReward: 0,
};

const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));
function careRewardFields(prev) {
  const now = Date.now();
  return now - (prev.lastCareReward || 0) >= 90_000 ? { coins: prev.coins + 2, lastCareReward: now } : {};
}
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function advanceTime(source, now = Date.now()) {
  const prev = source || INITIAL_GAME;
  const elapsed = Math.min(MAX_OFFLINE_SECONDS, Math.max(0, (now - (prev.lastUpdate || now)) / 1000));
  if (elapsed < 1) return { ...prev, lastUpdate: now };
  const minutes = elapsed / 60;
  const stats = { ...prev.stats };
  if (prev.sleeping) {
    stats.sleep += 1.5 * minutes;
    stats.hunger -= 0.28 * minutes;
    stats.fun -= 0.09 * minutes;
    stats.dirt += 0.09 * minutes;
  } else {
    stats.hunger -= 0.62 * minutes;
    stats.sleep -= 0.48 * minutes;
    stats.fun -= 0.42 * minutes;
    stats.dirt += 0.25 * minutes;
  }
  const criticalNeeds = [stats.hunger < 18, stats.sleep < 15, stats.fun < 14, stats.dirt > 86].filter(Boolean).length;
  if (criticalNeeds > 0) stats.health -= (0.24 + criticalNeeds * 0.18) * minutes;
  else if (stats.hunger > 52 && stats.sleep > 45 && stats.dirt < 56) stats.health += 0.055 * minutes;
  Object.keys(stats).forEach((key) => { stats[key] = clamp(stats[key]); });
  return { ...prev, stats, lastUpdate: now };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...INITIAL_GAME, lastUpdate: Date.now() };
    const saved = JSON.parse(raw);
    return advanceTime({
      ...INITIAL_GAME,
      ...saved,
      stats: { ...INITIAL_GAME.stats, ...(saved.stats || {}) },
      inventory: { ...INITIAL_GAME.inventory, ...(saved.inventory || {}) },
      unlockedSkins: Array.isArray(saved.unlockedSkins) && saved.unlockedSkins.length ? saved.unlockedSkins : ['dog_star'],
    });
  } catch {
    return { ...INITIAL_GAME, lastUpdate: Date.now() };
  }
}

let sharedAudio = null;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudio || sharedAudio.state === 'closed') sharedAudio = new AudioCtx();
  if (sharedAudio.state === 'suspended') sharedAudio.resume().catch(() => {});
  return sharedAudio;
}

function useSound({ enabled, type = 'tap' }) {
  const play = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = type === 'success' ? [523, 659, 784]
        : type === 'eat' ? [392, 494]
        : type === 'sleep' ? [349, 294, 247]
        : type === 'splash' ? [520, 680, 860]
        : type === 'heal' ? [440, 554, 659]
        : [520, 640];
      notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type === 'sleep' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(freq, now + index * 0.07);
        gain.gain.setValueAtTime(0.0001, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.045, now + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.18);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(now + index * 0.07);
        oscillator.stop(now + index * 0.07 + 0.2);
      });
    } catch {
      // Audio is optional; the game must still work if the browser blocks it.
    }
  }, [enabled, type]);
  return { play };
}

function getMood(stats, sleeping) {
  if (sleeping) return { emoji: '💤', title: 'Dulces sueños', text: 'Descansar también es una aventura.' };
  if (stats.health < 35) return { emoji: '🩹', title: 'Necesito cuidados', text: 'Un poquito de atención me hará bien.' };
  if (stats.hunger < 27) return { emoji: '🍎', title: '¡Tengo hambre!', text: '¿Compartimos algo rico?' };
  if (stats.sleep < 23) return { emoji: '🥱', title: 'Tengo sueñito', text: 'Una siesta me dejaría como nuevo.' };
  if (stats.dirt > 75) return { emoji: '🫧', title: '¡Qué baño!', text: 'Un poco de agua y jabón, por favor.' };
  if (stats.fun < 25) return { emoji: '🎾', title: '¿Jugamos?', text: '¡Tengo ganas de hacer algo divertido!' };
  if (Math.min(stats.hunger, stats.sleep, stats.health, 100 - stats.dirt, stats.fun) > 72) return { emoji: '✨', title: '¡Estoy genial!', text: 'Gracias por cuidarme tan bien.' };
  return { emoji: '🐾', title: '¡Hola, compi!', text: '¿Qué aventura tenemos hoy?' };
}

function getVibe(stats, sleeping) {
  if (sleeping) return 'sleepy';
  if (stats.health < 35) return 'sick';
  if (stats.dirt > 75) return 'dirty';
  if (stats.hunger < 27) return 'hungry';
  if (stats.fun < 25) return 'play';
  if (Math.min(stats.hunger, stats.sleep, stats.health, 100 - stats.dirt, stats.fun) > 72) return 'great';
  return 'ok';
}

function App() {
  const [game, setGame] = useState(INITIAL_GAME);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState('room');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [muted, setMuted] = useState(false);
  const [shopFilter, setShopFilter] = useState('Todo');
  const [bathStep, setBathStep] = useState(0);
  const [bathStarted, setBathStarted] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [petAnimation, setPetAnimation] = useState('');
  const [activeMiniGame, setActiveMiniGame] = useState('');
  const noticeTimer = useRef(null);
  const actionTimer = useRef(null);
  const rewardLock = useRef(false);
  const tapSound = useSound({ enabled: !muted, type: 'tap' });
  const successSound = useSound({ enabled: !muted, type: 'success' });
  const eatSound = useSound({ enabled: !muted, type: 'eat' });
  const sleepSound = useSound({ enabled: !muted, type: 'sleep' });
  const splashSound = useSound({ enabled: !muted, type: 'splash' });
  const healSound = useSound({ enabled: !muted, type: 'heal' });

  const playAction = useCallback((name, ms) => {
    setPetAnimation(name);
    if (actionTimer.current) clearTimeout(actionTimer.current);
    actionTimer.current = window.setTimeout(() => {
      setPetAnimation((current) => (current === name ? '' : current));
    }, ms);
  }, []);

  const notify = useCallback((message) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 2600);
  }, []);

  useLayoutEffect(() => {
    setGame(loadSave());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const interval = setInterval(() => setGame((prev) => advanceTime(prev)), 5000);
    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [game, ready]);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    if (actionTimer.current) clearTimeout(actionTimer.current);
  }, []);

  const mood = useMemo(() => getMood(game.stats, game.sleeping), [game.stats, game.sleeping]);
  const vibe = useMemo(() => getVibe(game.stats, game.sleeping), [game.stats, game.sleeping]);
  const totalItems = Object.values(game.inventory).reduce((sum, qty) => sum + qty, 0);

  const petTap = () => {
    tapSound.play();
    playAction(game.sleeping ? 'pet-sleep' : 'pet-hop', game.sleeping ? 900 : 900);
    setGame((prev) => ({ ...prev, ...careRewardFields(prev), stats: { ...prev.stats, fun: clamp(prev.stats.fun + (prev.sleeping ? 1 : 2)) } }));
    notify(game.sleeping ? 'Shhh… un cariño suavecito. 💤' : '¡Qué cosquillas! 🐾');
  };

  const applyItem = (item) => {
    if ((game.inventory[item.id] || 0) < 1) {
      notify(`No te quedan: ${item.name.toLowerCase()}. Puedes conseguir más en la tienda.`);
      return;
    }
    if (item.id === 'soap') {
      openBath();
      return;
    }
    if (item.id === 'medkit' && game.stats.health >= 98) {
      notify('Ya está estupenda. Guarda el botiquín para cuando haga falta.');
      return;
    }
    setGame((prev) => {
      if ((prev.inventory[item.id] || 0) < 1) return prev;
      if (item.id === 'medkit' && prev.stats.health >= 98) return prev;
      const inventory = { ...prev.inventory, [item.id]: Math.max(0, (prev.inventory[item.id] || 0) - 1) };
      const stats = { ...prev.stats };
      Object.entries(item.effects).forEach(([key, amount]) => { stats[key] = clamp(stats[key] + amount); });
      return { ...prev, ...careRewardFields(prev), inventory, stats };
    });
    const anim = item.category === 'Comida' ? 'pet-eat' : item.id === 'tennis' ? 'pet-play' : item.id === 'medkit' ? 'pet-heal' : 'pet-hop';
    playAction(anim, item.category === 'Comida' ? 1700 : 1200);
    (item.category === 'Comida' ? eatSound : item.id === 'medkit' ? healSound : successSound).play();
    notify(`${item.name}: ¡qué bien sienta!`);
    if (modal && item.id !== 'soap') setModal('');
  };

  const toggleSleep = () => {
    if (game.sleeping) {
      setGame((prev) => ({ ...prev, ...careRewardFields(prev), sleeping: false, lastUpdate: Date.now() }));
      playAction('pet-wake', 1200);
      notify('¡Buenos días! ¿Qué hacemos hoy?');
      tapSound.play();
    } else {
      setGame((prev) => ({ ...prev, ...careRewardFields(prev), sleeping: true, lastUpdate: Date.now() }));
      playAction('pet-sleep', 1000);
      notify('Buenas noches… la energía se recuperará poco a poco.');
      sleepSound.play();
    }
  };

  const buyItem = (item) => {
    let bought = false;
    setGame((prev) => {
      if (prev.coins < item.price) return prev;
      bought = true;
      return { ...prev, coins: prev.coins - item.price, inventory: { ...prev.inventory, [item.id]: (prev.inventory[item.id] || 0) + 1 } };
    });
    if (!bought) {
      notify('Te faltan monedas. ¡Prueba un minijuego para ganar más!');
      return;
    }
    successSound.play();
    notify(`${item.name} añadido al inventario.`);
  };

  const buyOrEquipSkin = (skin) => {
    if (game.unlockedSkins.includes(skin.id)) {
      if (game.equippedSkin !== skin.id) playAction('pet-sparkle', 1100);
      setGame((prev) => ({ ...prev, equippedSkin: skin.id }));
      successSound.play();
      notify(`${skin.name} está lista para la aventura.`);
      return;
    }
    let unlocked = false;
    setGame((prev) => {
      if (prev.unlockedSkins.includes(skin.id)) return { ...prev, equippedSkin: skin.id };
      if (prev.coins < skin.price) return prev;
      unlocked = true;
      return { ...prev, coins: prev.coins - skin.price, unlockedSkins: [...prev.unlockedSkins, skin.id], equippedSkin: skin.id };
    });
    if (!unlocked && game.coins < skin.price) {
      notify('Todavía faltan algunas monedas para desbloquear esta apariencia.');
      return;
    }
    playAction('pet-sparkle', 1100);
    successSound.play();
    notify(`¡Desbloqueaste ${skin.name}!`);
  };

  const openBath = () => {
    if (!(bathStarted && bathStep < 3)) {
      setBathStep(0);
      setBathStarted(false);
    }
    setModal('bath');
  };

  const beginBathStroke = () => {
    if (!bathStarted) {
      if ((game.inventory.soap || 0) < 1) {
        notify('Necesitas jabón suave. Puedes comprarlo en la tienda.');
        setModal('shop');
        setShopFilter('Cuidados');
        return;
      }
      setGame((prev) => ({ ...prev, inventory: { ...prev.inventory, soap: prev.inventory.soap - 1 } }));
      setBathStarted(true);
    }
    const nextStep = bathStep + 1;
    setBathStep(nextStep);
    playAction('pet-bath', 1600);
    splashSound.play();
    if (nextStep >= 3) {
      setGame((prev) => ({ ...prev, ...careRewardFields(prev), stats: { ...prev.stats, dirt: clamp(prev.stats.dirt - 42), fun: clamp(prev.stats.fun + 6) } }));
      successSound.play();
      notify('¡Quedó impecable! +6 de diversión.');
      setBathStep(3);
    } else {
      setGame((prev) => ({ ...prev, stats: { ...prev.stats, dirt: clamp(prev.stats.dirt - 10) } }));
    }
  };

  const finishMiniGame = (reward, funGain, label) => {
    if (rewardLock.current) return;
    rewardLock.current = true;
    setGame((prev) => ({ ...prev, coins: prev.coins + reward, stats: { ...prev.stats, fun: clamp(prev.stats.fun + funGain) } }));
    setModal('');
    setActiveMiniGame('');
    setView('room');
    playAction('pet-play', 1200);
    successSound.play();
    notify(`${label}: +${reward} monedas y +${funGain} diversión.`);
  };

  const takeDailyBonus = () => {
    const key = todayKey();
    if (game.lastDailyBonus === key) {
      notify('El regalo de hoy ya está recogido. ¡Vuelve mañana!');
      return;
    }
    setGame((prev) => ({ ...prev, coins: prev.coins + 12, lastDailyBonus: key }));
    successSound.play();
    notify('¡Regalo diario! +12 monedas.');
  };

  const resetGame = () => {
    const fresh = { ...INITIAL_GAME, lastUpdate: Date.now() };
    setGame(fresh);
    setResetConfirm(false);
    setModal('');
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(fresh)); } catch { /* Ignore storage errors. */ }
    notify('Partida reiniciada. ¡Una nueva aventura comienza!');
  };

  const navTo = (next) => {
    setView(next);
    setModal('');
    setActiveMiniGame('');
    tapSound.play();
  };

  const openGames = (gameId = '') => {
    rewardLock.current = false;
    setActiveMiniGame(gameId);
    setModal('games');
  };

  const roomNote = game.sleeping ? 'La habitación está tranquila: tu mascota está descansando.' : 'Una habitación pequeñita para aventuras enormes.';

  return (
    <div className={`app-shell ${game.sleeping ? 'is-sleeping' : ''}`}>
      <header className="topbar">
        <div className="brand-lockup" onClick={() => navTo('room')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navTo('room')}>
          <div className="brand-mark">🐾</div>
          <div><div className="brand-name">Tango<span>World</span></div><div className="brand-tagline">tu pequeña gran aventura</div></div>
        </div>
        <div className="top-actions">
          <button className="daily-button" onClick={takeDailyBonus} title="Recoge tus monedas diarias"><span>🎁</span><span className="hide-small">Regalo diario</span></button>
          <div className="coin-pill"><span className="coin-icon">✦</span><strong>{game.coins}</strong><span className="coin-label">monedas</span></div>
          <button className="icon-button sound-button" aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'} title={muted ? 'Activar sonido' : 'Silenciar sonido'} onClick={() => setMuted((value) => !value)}>{muted ? '🔇' : '🔊'}</button>
          <button className="icon-button settings-button" aria-label="Configuración" title="Configuración" onClick={() => setModal('settings')}>⚙️</button>
        </div>
      </header>

      <main className="main-layout">
        <section className="room-column">
          <div className="section-kicker"><span className="status-dot" /> TU REFUGIO <span className="tiny-sparkle">✦</span></div>
          <div className="room-card">
            <div className="room-heading">
              <div><h1>¡Hola, compi!</h1><p>{roomNote}</p></div>
              <div className={`mood-pill mood-${vibe}`}><span>{mood.emoji}</span>{mood.title}</div>
            </div>
            <div className={`scene-wrap ${game.sleeping ? 'is-night' : 'is-day'} ${petAnimation}`}>
              <GameScene skin={game.equippedSkin} sleeping={game.sleeping} action={petAnimation} vibe={vibe} onPetTap={petTap} />
              <div className="scene-vignette" />
              <FxBurst kind={petAnimation} />
              {game.sleeping && <div className="sleep-overlay"><span>z</span><span>z</span><span>z</span></div>}
              <div className="scene-badge">{game.sleeping ? 'Noche en casa' : 'Tarde suave'}</div>
              <div className="scene-caption"><span className="caption-paw">🐾</span><span>Toca para acariciar</span><span className="caption-divider">·</span><span>{SKINS.find((s) => s.id === game.equippedSkin)?.name || 'Tu mascota'}</span></div>
            </div>
            <div className="pet-dialogue" aria-live="polite"><span className="dialogue-face">{mood.emoji}</span><div><strong>{mood.title}</strong><p>{mood.text}</p></div><span className="dialogue-sparkle">✧</span></div>
            <div className="room-footer"><span><span className="footer-star">✦</span> Toca a tu mascota para acariciarla</span><span className="online-status"><i /> progreso guardado</span></div>
          </div>

          <div className="care-section">
            <div className="section-title-row"><div><h2>Cuidados rápidos</h2><p>Pequeños gestos, grandes sonrisas.</p></div><span className="section-ornament">✳</span></div>
            <div className="care-actions">
              <button className="care-action food-action" onClick={() => setModal('food')}><span className="care-emoji">🍎</span><span className="care-label">Comida</span><span className="care-sublabel">Dale energía</span></button>
              <button className={`care-action sleep-action ${game.sleeping ? 'active-action' : ''}`} onClick={toggleSleep}><span className="care-emoji">{game.sleeping ? '☀️' : '🌙'}</span><span className="care-label">{game.sleeping ? 'Despertar' : 'Dormir'}</span><span className="care-sublabel">{game.sleeping ? 'Ya descansó' : 'Recarga energía'}</span></button>
              <button className="care-action health-action" onClick={() => { if ((game.inventory.medkit || 0) > 0) applyItem(ITEMS.find((i) => i.id === 'medkit')); else { setModal('shop'); setShopFilter('Cuidados'); } }}><span className="care-emoji">🩹</span><span className="care-label">Salud</span><span className="care-sublabel">Mímalo un poco</span></button>
              <button className="care-action bath-action" onClick={openBath}><span className="care-emoji">🫧</span><span className="care-label">Baño</span><span className="care-sublabel">Brilla otra vez</span></button>
              <button className="care-action play-action" onClick={() => openGames()}><span className="care-emoji">🎾</span><span className="care-label">Jugar</span><span className="care-sublabel">¡A divertirse!</span></button>
            </div>
          </div>
        </section>

        <aside className="side-column">
          <section className="status-card">
            <div className="side-card-heading"><div><span className="section-kicker">BIENESTAR</span><h2>Así me siento</h2></div><span className="heart-badge">♡</span></div>
            <div className="overall-wellbeing"><div className="wellbeing-ring" style={{ '--ring-value': `${Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5)}%` }}><div><strong>{Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5)}</strong><small>/100</small></div></div><div><strong>{Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5) > 74 ? '¡Todo genial!' : 'Vamos paso a paso'}</strong><p>Mi bienestar general</p></div></div>
            <div className="stat-list">{Object.entries(STAT_META).map(([key, meta]) => {
              const raw = game.stats[key];
              const value = key === 'dirt' ? 100 - raw : raw;
              const display = key === 'dirt' ? (raw < 25 ? 'Impecable' : raw < 60 ? 'Necesita baño' : '¡Muy sucio!') : value < 22 ? 'Bajito' : value < 55 ? 'Regular' : value > 82 ? 'Genial' : 'Bien';
              return <div className="stat-row" key={key}><div className="stat-topline"><div className="stat-name"><span className={`stat-icon stat-${meta.color}`}>{meta.icon}</span><span>{meta.label}</span></div><span className="stat-value">{Math.round(key === 'dirt' ? 100 - raw : raw)}<small>/100</small></span></div><div className="stat-track"><div className={`stat-fill fill-${meta.color}`} style={{ width: `${clamp(value)}%` }} /></div><div className="stat-foot"><span>{display}</span><span>{key === 'dirt' ? 'limpieza' : 'nivel'}</span></div></div>;
            })}</div>
            <div className="status-tip"><span>💡</span><p>{game.sleeping ? 'Mientras duerme, recupera energía lentamente.' : 'Las necesidades cambian con el tiempo. ¡Un ratito de cuidado hace la diferencia!'}</p></div>
          </section>

          <section className="inventory-card">
            <div className="side-card-heading"><div><span className="section-kicker">MOCHILA</span><h2>Mis cositas</h2></div><span className="inventory-count">{totalItems} <small>objetos</small></span></div>
            <div className="inventory-items">{ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0).slice(0, 4).map((item) => <button key={item.id} className="inventory-item" title={`${item.name}: ${game.inventory[item.id]}`} onClick={() => item.category === 'Comida' ? setModal('food') : item.id === 'soap' ? openBath() : applyItem(item)}><span>{item.icon}</span><small>{game.inventory[item.id]}</small></button>)}<button className="inventory-add" onClick={() => setModal('shop')} aria-label="Abrir tienda">＋</button></div>
            <button className="text-link" onClick={() => setModal('shop')}>Ver tienda completa <span>↗</span></button>
          </section>

          <section className="quest-card"><div className="quest-spark">✧</div><div className="quest-copy"><span className="section-kicker">RETO DEL DÍA</span><h3>Un ratito de diversión</h3><p>Juega un minijuego y gana monedas para tu próxima sorpresa.</p><button className="quest-button" onClick={() => openGames()}>Aceptar reto <span>→</span></button></div><div className="quest-art">🎮</div></section>
        </aside>
      </main>

      <nav className="bottom-nav" aria-label="Navegación principal">
        <button className={view === 'room' ? 'selected' : ''} onClick={() => navTo('room')}><span>🏡</span><small>Habitación</small></button>
        <button className={view === 'shop' ? 'selected' : ''} onClick={() => { setView('shop'); setModal('shop'); }}><span>🛍️</span><small>Tienda</small></button>
        <button className={view === 'wardrobe' ? 'selected' : ''} onClick={() => { setView('wardrobe'); setModal('wardrobe'); }}><span>👒</span><small>Vestidor</small></button>
        <button className={view === 'games' ? 'selected' : ''} onClick={() => { setView('games'); openGames(); }}><span>🎮</span><small>Minijuegos</small></button>
      </nav>

      {notice && <div className="toast-message" role="status"><span>✦</span>{notice}</div>}

      {modal && <div className="modal-backdrop" onPointerDown={(event) => { if (event.target === event.currentTarget) { setModal(''); setActiveMiniGame(''); setView('room'); } }}>
        <div className={`modal-card ${modal === 'games' && activeMiniGame ? 'game-modal-card' : ''}`} role="dialog" aria-modal="true" aria-label={modal === 'food' ? 'Comida' : modal === 'shop' ? 'Tienda' : modal === 'wardrobe' ? 'Vestidor' : modal === 'bath' ? 'Baño' : modal === 'games' ? 'Minijuegos' : 'Configuración'}>
          <button className="modal-close" aria-label="Cerrar" onClick={() => { setModal(''); setActiveMiniGame(''); setView('room'); }}>×</button>
          {modal === 'food' && <FoodModal inventory={game.inventory} onUse={applyItem} onShop={() => setModal('shop')} />}
          {modal === 'bath' && <BathModal step={bathStep} started={bathStarted} soap={game.inventory.soap || 0} onScrub={beginBathStroke} onShop={() => { setModal('shop'); setShopFilter('Cuidados'); }} onClose={() => setModal('')} />}
          {modal === 'shop' && <ShopModal items={ITEMS} inventory={game.inventory} coins={game.coins} filter={shopFilter} onFilter={setShopFilter} onBuy={buyItem} />}
          {modal === 'wardrobe' && <WardrobeModal skins={SKINS} unlocked={game.unlockedSkins} equipped={game.equippedSkin} coins={game.coins} onChoose={buyOrEquipSkin} />}
          {modal === 'games' && <GamesModal active={activeMiniGame} onSelect={setActiveMiniGame} onBack={() => setActiveMiniGame('')} onFinish={finishMiniGame} />}
          {modal === 'settings' && <SettingsModal muted={muted} onMute={() => setMuted((v) => !v)} onReset={() => setResetConfirm(true)} onClose={() => setModal('')} />}
          {resetConfirm && modal === 'settings' && <div className="confirm-layer"><div className="confirm-box"><span className="confirm-icon">⚠️</span><h3>¿Empezar de nuevo?</h3><p>Se borrarán las monedas, los objetos y las apariencias desbloqueadas de esta partida.</p><div className="confirm-actions"><button className="secondary-button" onClick={() => setResetConfirm(false)}>Cancelar</button><button className="danger-button" onClick={resetGame}>Reiniciar</button></div></div></div>}
        </div>
      </div>}
      <footer className="site-footer"><span>✦ Tangoworld</span><span>Una mascota, mil momentos.</span><span>Guardado local · sin cuentas</span></footer>
    </div>
  );
}

function FxBurst({ kind }) {
  if (!kind) return null;
  const sets = {
    'pet-hop': ['💗', '✨', '🤍', '💗', '✧'],
    'pet-eat': ['🍎', '✨', '🦴', '💛'],
    'pet-bath': ['🫧', '💧', '✨', '🫧', '✧'],
    'pet-heal': ['💗', '✨', '💚', '✦'],
    'pet-play': ['⭐', '🎾', '✨', '💛'],
    'pet-wake': ['☀️', '✨', '💛'],
    'pet-sparkle': ['✨', '✦', '⭐', '✧', '✨'],
    'pet-sleep': ['💤', '🌙', '✨', 'z'],
  };
  const bits = sets[kind] || ['✨'];
  return (
    <div className={`fx-layer fx-${kind}`} aria-hidden="true">
      {bits.map((glyph, index) => (
        <span key={`${kind}-${index}`} className="fx-bit" style={{ '--dx': `${(index - (bits.length - 1) / 2) * 46}px`, animationDelay: `${index * 0.08}s` }}>{glyph}</span>
      ))}
    </div>
  );
}

function FoodModal({ inventory, onUse, onShop }) {
  const foodItems = ITEMS.filter((item) => item.category === 'Comida');
  return <><div className="modal-eyebrow">HORA DE COMER</div><h2>¿Qué se te antoja?</h2><p className="modal-intro">Una pancita feliz empieza con un buen bocadito.</p><div className="food-grid">{foodItems.map((item) => <div className="food-tile" key={item.id}><span className="food-art">{item.icon}</span><div className="food-info"><strong>{item.name}</strong><p>{item.desc}</p><small>+{item.effects.hunger} hambre{item.effects.fun ? ` · +${item.effects.fun} diversión` : ''}</small></div><div className="food-action-area"><span className="quantity-chip">×{inventory[item.id] || 0}</span><button className="primary-small" disabled={(inventory[item.id] || 0) < 1} onClick={() => onUse(item)}>Dar</button></div></div>)}</div><div className="modal-bottom-row"><button className="secondary-button" onClick={onShop}>Conseguir más comida ↗</button><span className="helper-note">Los objetos se guardan en tu mochila.</span></div></>;
}

function BathModal({ step, started, soap, onScrub, onShop, onClose }) {
  const done = step >= 3;
  return <><div className="modal-eyebrow">SPA PARA MASCOTAS</div><h2>¡Hora del baño!</h2><p className="modal-intro">Un baño rápido para dejar el pelaje reluciente.</p><div className={`bath-visual ${done ? 'bath-done' : ''}`}><div className="bath-bubble bubble-a">○</div><div className="bath-bubble bubble-b">✧</div><div className="bath-tub">🛁</div><div className="bath-pet">{done ? '✨' : step > 0 ? '🫧' : '🐶'}</div><div className="bath-bubble bubble-c">○</div></div><div className="bath-progress-row"><strong>{done ? '¡Baño terminado!' : `Paso ${step + 1} de 3`}</strong><span>{done ? 'Mascota impecable' : `${Math.round((step / 3) * 100)}%`}</span></div><div className="bath-track"><div style={{ width: `${(step / 3) * 100}%` }} /></div>{!done ? <><p className="bath-instruction">{step === 0 ? 'Empieza con un poco de jabón suave.' : step === 1 ? '¡Muy bien! Frota con cuidado.' : 'Un último enjuague y listo.'}</p><button className="primary-button full-button" onClick={onScrub} disabled={soap < 1 && !started}>{soap < 1 && !started ? 'Necesitas jabón' : step === 0 ? 'Aplicar jabón y lavar' : step === 1 ? 'Seguir lavando' : 'Enjuagar y terminar'} <span>✦</span></button>{soap < 1 && !started && <button className="text-link centered-link" onClick={onShop}>Comprar jabón suave ↗</button>}</> : <button className="primary-button full-button" onClick={onClose}>¡Listo, qué limpito! <span>♡</span></button>}</>;
}

function ShopModal({ items, inventory, coins, filter, onFilter, onBuy }) {
  const categories = ['Todo', 'Comida', 'Cuidados', 'Juguetes'];
  const visibleItems = items.filter((item) => filter === 'Todo' || item.category === filter);
  return <><div className="modal-eyebrow">UN MERCADITO MUY ESPECIAL</div><div className="modal-title-line"><div><h2>La tiendita</h2><p className="modal-intro">Pequeñas cosas para cuidar y sorprender.</p></div><div className="coin-pill modal-coins"><span className="coin-icon">✦</span><strong>{coins}</strong></div></div><div className="filter-pills">{categories.map((cat) => <button key={cat} className={filter === cat ? 'filter-active' : ''} onClick={() => onFilter(cat)}>{cat}</button>)}</div><div className="shop-grid">{visibleItems.map((item) => <article className="shop-item-card" key={item.id}><div className="shop-item-top"><span className="shop-item-art">{item.icon}</span><span className="shop-category">{item.category}</span></div><h3>{item.name}</h3><p>{item.desc}</p><div className="shop-item-bottom"><div><strong className="item-price">✦ {item.price}</strong><small>En mochila: {inventory[item.id] || 0}</small></div><button className="buy-button" onClick={() => onBuy(item)} disabled={coins < item.price}>Comprar</button></div></article>)}</div><p className="shop-note">Todo se compra con monedas del juego. No hay compras reales.</p></>;
}

function WardrobeModal({ skins, unlocked, equipped, coins, onChoose }) {
  return <><div className="modal-eyebrow">ARMARIO DE AVENTURAS</div><div className="modal-title-line"><div><h2>El vestidor</h2><p className="modal-intro">Cada apariencia es un PNG original completo.</p></div><div className="coin-pill modal-coins"><span className="coin-icon">✦</span><strong>{coins}</strong></div></div><div className="wardrobe-grid">{skins.map((skin) => { const owned = unlocked.includes(skin.id); const active = equipped === skin.id; return <article className={`skin-card ${active ? 'skin-equipped' : ''}`} key={skin.id}><div className="skin-preview"><img src={`/assets/pets/${skin.id}.png`} alt={`Vista previa: ${skin.name}`} loading="lazy" />{active && <span className="equipped-badge">✓ Equipada</span>}{!owned && <span className="skin-price-badge">✦ {skin.price}</span>}</div><div className="skin-copy"><div className="skin-name-row"><h3>{skin.name}</h3><span className={`rarity rarity-${skin.rarity.toLowerCase()}`}>{skin.rarity}</span></div><p>{skin.desc}</p><button className={active ? 'equipped-button' : owned ? 'secondary-button skin-button' : 'buy-button skin-button'} onClick={() => onChoose(skin)}>{active ? 'En uso ✓' : owned ? 'Equipar' : `Desbloquear · ✦ ${skin.price}`}</button></div></article>; })}</div></>;
}

function SettingsModal({ muted, onMute, onReset, onClose }) {
  return <><div className="modal-eyebrow">AJUSTES</div><h2>Tu espacio, tus reglas</h2><p className="modal-intro">Configura la experiencia a tu gusto.</p><div className="settings-options"><button className="settings-row" onClick={onMute}><span className="settings-icon">{muted ? '🔇' : '🔊'}</span><span><strong>Sonidos</strong><small>{muted ? 'Desactivados' : 'Activados'}</small></span><span className={`toggle-switch ${!muted ? 'toggle-on' : ''}`}><i /></span></button><div className="settings-row static-row"><span className="settings-icon">💾</span><span><strong>Guardado automático</strong><small>Este dispositivo · localStorage</small></span><span className="saved-check">✓</span></div><div className="settings-row static-row"><span className="settings-icon">🌙</span><span><strong>Progreso al volver</strong><small>Hasta 12 horas fuera de línea</small></span></div></div><div className="settings-bottom"><button className="danger-outline" onClick={onReset}>Reiniciar partida</button><button className="primary-button" onClick={onClose}>Guardar y volver</button></div></>;
}

function GamesModal({ active, onSelect, onBack, onFinish }) {
  if (!active) return <><div className="modal-eyebrow">PEQUEÑAS AVENTURAS</div><h2>¡Hora de jugar!</h2><p className="modal-intro">Diviértete un ratito y gana monedas para tu próxima compra.</p><div className="minigame-grid"><button className="minigame-card stars-card" onClick={() => onSelect('stars')}><span className="minigame-art">🌟</span><span className="minigame-tag">Reflejos</span><strong>Atrapa las estrellas</strong><p>Mueve la cesta y recoge estrellas sin tocar las piedras.</p><span className="minigame-reward">✦ Hasta 35 monedas</span><span className="minigame-arrow">↗</span></button><button className="minigame-card memory-card" onClick={() => onSelect('memory')}><span className="minigame-art">🃏</span><span className="minigame-tag">Memoria</span><strong>Parejas mágicas</strong><p>Encuentra los pares de cartas con menos intentos.</p><span className="minigame-reward">✦ Hasta 25 monedas</span><span className="minigame-arrow">↗</span></button><button className="minigame-card run-card" onClick={() => onSelect('run')}><span className="minigame-art">🏃</span><span className="minigame-tag">Acción</span><strong>Carrera de obstáculos</strong><p>Salta, esquiva y consigue puntos en el recorrido.</p><span className="minigame-reward">✦ Hasta 30 monedas</span><span className="minigame-arrow">↗</span></button></div><div className="games-footer-note"><span>🎮</span> Se puede jugar con teclado, ratón o pantalla táctil.</div></>;
  return <MiniGame key={active} mode={active} onBack={onBack} onFinish={onFinish} />;
}

function MiniGame({ mode, onBack, onFinish }) {
  if (mode === 'memory') return <MemoryGame onBack={onBack} onFinish={onFinish} />;
  if (mode === 'run') return <RunnerGame onBack={onBack} onFinish={onFinish} />;
  return <StarsGame onBack={onBack} onFinish={onFinish} />;
}

function GameFrame({ eyebrow, title, instructions, children, onBack }) {
  return <><div className="game-frame-top"><button className="game-back" onClick={onBack}>← Minijuegos</button><div className="modal-eyebrow">{eyebrow}</div></div><h2>{title}</h2><p className="modal-intro">{instructions}</p>{children}</>;
}

function StarsGame({ onBack, onFinish }) {
  const [basket, setBasket] = useState(50);
  const [objects, setObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [seconds, setSeconds] = useState(22);
  const [finished, setFinished] = useState(false);
  const objectRef = useRef([]);
  const basketRef = useRef(50);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const startRef = useRef(0);
  const spawnRef = useRef(0);
  const finishedRef = useRef(false);
  const heldRef = useRef(new Set());

  const moveBasket = (value) => { const next = Math.min(92, Math.max(8, value)); basketRef.current = next; setBasket(next); };
  useEffect(() => {
    const origin = performance.now();
    startRef.current = origin;
    spawnRef.current = origin;
    const keyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'KeyA' || e.key.toLowerCase() === 'a') { e.preventDefault(); heldRef.current.add('left'); }
      if (e.key === 'ArrowRight' || e.key === 'KeyD' || e.key.toLowerCase() === 'd') { e.preventDefault(); heldRef.current.add('right'); }
    };
    const keyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'KeyA' || e.key.toLowerCase() === 'a') heldRef.current.delete('left');
      if (e.key === 'ArrowRight' || e.key === 'KeyD' || e.key.toLowerCase() === 'd') heldRef.current.delete('right');
    };
    const blur = () => heldRef.current.clear();
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', blur);
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (finishedRef.current) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let steer = 0;
      if (heldRef.current.has('left')) steer -= 1;
      if (heldRef.current.has('right')) steer += 1;
      if (steer) moveBasket(basketRef.current + steer * 48 * dt);
      const elapsed = (now - startRef.current) / 1000;
      setSeconds(Math.max(0, Math.ceil(22 - elapsed)));
      if (elapsed >= 22 || hitsRef.current >= 3) { finishedRef.current = true; setFinished(true); return; }
      let next = objectRef.current.map((obj) => ({ ...obj, y: obj.y + 26 * dt }));
      if (now - spawnRef.current > 720) {
        next.push({ id: `${now}-${Math.random()}`, x: 7 + Math.random() * 86, y: -6, kind: Math.random() < 0.22 ? 'rock' : 'star' });
        spawnRef.current = now;
      }
      const keep = [];
      next.forEach((obj) => {
        if (obj.y >= 78 && obj.y <= 96 && Math.abs(obj.x - basketRef.current) < 12) {
          if (obj.kind === 'star') { scoreRef.current += 1; setScore(scoreRef.current); }
          else { hitsRef.current += 1; setHits(hitsRef.current); }
          return;
        }
        if (obj.y < 108) keep.push(obj);
      });
      objectRef.current = keep;
      setObjects(keep);
    };
    frame = requestAnimationFrame(tick);
    window.__controlsTest = {
      getX: () => basketRef.current,
      getYaw: () => 0,
      getSpeed: () => 0,
      setKeys: (codes) => {
        heldRef.current = new Set();
        if (codes.includes('KeyA') || codes.includes('ArrowLeft')) heldRef.current.add('left');
        if (codes.includes('KeyD') || codes.includes('ArrowRight')) heldRef.current.add('right');
      },
    };
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
      if (window.__controlsTest?.getX) delete window.__controlsTest;
    };
  }, []);

  const moveByPointer = (e) => {
    if (e.buttons || e.pointerType === 'touch') {
      const rect = e.currentTarget.getBoundingClientRect();
      moveBasket(((e.clientX - rect.left) / rect.width) * 100);
    }
  };
  const reward = Math.min(35, 5 + score * 2);
  return <GameFrame eyebrow="REFLEJOS · 22 SEGUNDOS" title="Atrapa las estrellas" instructions="Mueve la cesta con ← → o A/D. En móvil, arrastra el dedo por el área. ¡Evita las piedras!" onBack={onBack}><div className="game-hud"><span>🌟 Puntos <strong>{score}</strong></span><span>⏱ {seconds}s</span><span>🪨 Golpes {hits}/3</span></div><div className="stars-playfield" onPointerDown={moveByPointer} onPointerMove={moveByPointer}>{objects.map((obj) => <span key={obj.id} className={`falling-object ${obj.kind === 'rock' ? 'falling-rock' : ''}`} style={{ left: `${obj.x}%`, top: `${obj.y}%` }}>{obj.kind === 'rock' ? '🪨' : '⭐'}</span>)}<div className="catch-basket" style={{ left: `${basket}%` }}>🧺</div>{finished && <div className="game-over-overlay"><span>✨</span><strong>¡Buen trabajo!</strong><p>Recogiste {score} estrellas.</p><button className="primary-button" onClick={() => onFinish(reward, Math.min(18, score + 4), 'Atrapa las estrellas')}>Cobrar ✦ {reward}</button></div>}</div><div className="mobile-game-controls"><button onPointerDown={(e) => { e.preventDefault(); moveBasket(basketRef.current - 10); }}>←</button><span>Mueve la cesta</span><button onPointerDown={(e) => { e.preventDefault(); moveBasket(basketRef.current + 10); }}>→</button></div></GameFrame>;
}

const MEMORY_SYMBOLS = ['🍎', '⭐', '🧸', '🎾', '🫧', '🌙'];
function MemoryGame({ onBack, onFinish }) {
  const [cards, setCards] = useState(() => [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].map((symbol, idx) => ({ id: idx, symbol })).sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const cardsRef = useRef(cards);
  useEffect(() => { cardsRef.current = cards; }, [cards]);
  useEffect(() => {
    if (flipped.length !== 2) return undefined;
    setLocked(true);
    const [a, b] = flipped;
    const same = cardsRef.current.find((c) => c.id === a)?.symbol === cardsRef.current.find((c) => c.id === b)?.symbol;
    const timeout = setTimeout(() => {
      if (same) setMatched((prev) => [...prev, a, b]);
      setFlipped([]);
      setLocked(false);
    }, same ? 420 : 850);
    return () => clearTimeout(timeout);
  }, [flipped]);
  useEffect(() => { if (matched.length === cards.length && cards.length) setFinished(true); }, [matched, cards.length]);
  const chooseCard = (id) => {
    if (locked || matched.includes(id) || flipped.includes(id) || finished || flipped.length >= 2) return;
    if (flipped.length === 1) setMoves((n) => n + 1);
    setFlipped((prev) => (prev.length >= 2 ? prev : [...prev, id]));
  };
  const reward = Math.min(25, Math.max(10, 28 - moves));
  return <GameFrame eyebrow="MEMORIA · SIN LÍMITE DE TIEMPO" title="Parejas mágicas" instructions="Voltea dos cartas por turno y encuentra los seis pares. ¡Intenta recordar dónde está cada símbolo!" onBack={onBack}><div className="game-hud"><span>🃏 Parejas <strong>{matched.length / 2}/6</strong></span><span>🎯 Intentos <strong>{moves}</strong></span><span>✦ Premio <strong>hasta 25</strong></span></div><div className="memory-grid">{cards.map((card) => { const faceUp = flipped.includes(card.id) || matched.includes(card.id); return <button key={card.id} className={`memory-card ${faceUp ? 'memory-face-up' : ''} ${matched.includes(card.id) ? 'memory-matched' : ''}`} onClick={() => chooseCard(card.id)} aria-label={faceUp ? card.symbol : 'Carta oculta'}>{faceUp ? card.symbol : <span>✦</span>}</button>; })}{finished && <div className="game-over-overlay memory-over"><span>🏆</span><strong>¡Todas las parejas!</strong><p>Lo lograste en {moves} intentos.</p><button className="primary-button" onClick={() => onFinish(reward, 16, 'Parejas mágicas')}>Cobrar ✦ {reward}</button></div>}</div></GameFrame>;
}

function RunnerGame({ onBack, onFinish }) {
  const [obstacles, setObstacles] = useState([]);
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [finished, setFinished] = useState(false);
  const obstaclesRef = useRef([]);
  const jumpingRef = useRef(false);
  const jumpUntilRef = useRef(0);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const startedRef = useRef(Date.now());
  const spawnRef = useRef(Date.now() + 900);
  const finishedRef = useRef(false);
  const jump = () => {
    if (finishedRef.current || jumpingRef.current) return;
    jumpingRef.current = true;
    jumpUntilRef.current = Date.now() + 650;
    setJumping(true);
  };
  useEffect(() => {
    const keyDown = (e) => { if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', keyDown);
    const timer = setInterval(() => {
      if (finishedRef.current) return;
      const now = Date.now();
      const elapsed = (now - startedRef.current) / 1000;
      setSeconds(Math.max(0, Math.ceil(20 - elapsed)));
      if (jumpingRef.current && now > jumpUntilRef.current) { jumpingRef.current = false; setJumping(false); }
      if (elapsed >= 20 || hitsRef.current >= 3) { finishedRef.current = true; setFinished(true); return; }
      let next = obstaclesRef.current.map((o) => ({ ...o, x: o.x - 3.2 }));
      if (now > spawnRef.current) {
        next.push({ id: now, x: 103, kind: Math.random() < 0.28 ? 'double' : 'single', counted: false });
        spawnRef.current = now + 1000 + Math.random() * 360;
      }
      const keep = [];
      next.forEach((o) => {
        if (o.x <= 22 && o.x >= 13 && !o.counted) {
          o.counted = true;
          if (!jumpingRef.current) { hitsRef.current += 1; setHits(hitsRef.current); }
          else { scoreRef.current += 1; setScore(scoreRef.current); }
        }
        if (o.x < 4) {
          if (!o.counted) { scoreRef.current += 1; setScore(scoreRef.current); }
        } else keep.push(o);
      });
      obstaclesRef.current = keep;
      setObstacles(keep);
    }, 100);
    return () => { clearInterval(timer); window.removeEventListener('keydown', keyDown); };
  }, []);
  const reward = Math.min(30, 6 + score * 2);
  return <GameFrame eyebrow="ACCIÓN · 20 SEGUNDOS" title="Carrera de obstáculos" instructions="Toca SALTAR o presiona espacio / ↑ para esquivar los obstáculos y recoger puntos." onBack={onBack}><div className="game-hud"><span>🏁 Puntos <strong>{score}</strong></span><span>⏱ {seconds}s</span><span>💥 Golpes {hits}/3</span></div><div className="runner-field" onPointerDown={jump}><div className="runner-sky-sun">☀️</div><div className="runner-cloud cloud-one">☁️</div><div className="runner-cloud cloud-two">☁️</div><div className="runner-hills" /><div className="runner-ground" /><div className={`runner-character ${jumping ? 'runner-jump' : ''}`}>🐶</div>{obstacles.map((o) => <span key={o.id} className="runner-obstacle" style={{ left: `${o.x}%` }}>{o.kind === 'double' ? '🌵' : '🪵'}</span>)}{finished && <div className="game-over-overlay"><span>🏁</span><strong>¡Carrera terminada!</strong><p>Sumaste {score} puntos.</p><button className="primary-button" onClick={() => onFinish(reward, Math.min(20, score + 6), 'Carrera de obstáculos')}>Cobrar ✦ {reward}</button></div>}</div><button className="primary-button jump-button" onPointerDown={(e) => e.stopPropagation()} onClick={jump} disabled={finished}>SALTAR <span>↑</span></button></GameFrame>;
}

export default App;
