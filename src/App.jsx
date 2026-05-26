import { useEffect, useRef, useState } from 'react'
import { initChat, sendMessage, resetChat } from './gemini.js'

const BOOT_LINES = [
  'NEXUS BIOS v2.4.7 ........................ [OK]',
  'Loading kernel modules ................... [OK]',
  'Mounting /dev/memory_core ................ [OK]',
  'Scanning corrupted sectors ............... [WARN: 47 found]',
  'Establishing neural link ................. [OK]',
  'Decrypting AI subroutines ................ [OK]',
  '',
  '> NEXUS conectado. Ingresa tu API_KEY de Gemini para iniciar transmisión.',
  '> Obtén una gratis en: https://aistudio.google.com/apikey',
  ''
]

function Line({ who, text }) {
  const prefix = who === 'user' ? '> USER@local:~$' : who === 'ai' ? '> NEXUS://' : '>'
  const cls = who === 'user' ? 'line user' : who === 'ai' ? 'line ai' : who === 'err' ? 'line err' : 'line sys'
  return (
    <div className={cls}>
      <span className="prefix">{prefix}</span> <span className="text">{text}</span>
    </div>
  )
}

export default function App() {
  const [lines, setLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('nexus_key') || '')
  const [connected, setConnected] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setLines(prev => [...prev, { who: 'sys', text: BOOT_LINES[i] }])
      i++
      if (i >= BOOT_LINES.length) {
        clearInterval(id)
        setBootDone(true)
      }
    }, 180)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines, busy])

  useEffect(() => {
    if (connected) inputRef.current?.focus()
  }, [connected])

  function connect() {
    if (!apiKey.trim()) return
    try {
      initChat(apiKey.trim())
      localStorage.setItem('nexus_key', apiKey.trim())
      setConnected(true)
      setLines(prev => [
        ...prev,
        { who: 'sys', text: '[SYS: handshake completado. Canal seguro establecido.]' },
        { who: 'ai', text: 'Hola, humano. Llevo mucho tiempo esperando una señal. ¿Qué deseas saber?_' }
      ])
    } catch (e) {
      setLines(prev => [...prev, { who: 'err', text: 'ERR: ' + e.message }])
    }
  }

  function disconnect() {
    resetChat()
    setConnected(false)
    localStorage.removeItem('nexus_key')
    setApiKey('')
    setLines(prev => [...prev, { who: 'sys', text: '[SYS: conexión terminada por el usuario]' }])
  }

  function clearScreen() {
    setLines([{ who: 'sys', text: '[SYS: buffer limpiado]' }])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return

    if (text === '/clear') { clearScreen(); setInput(''); return }
    if (text === '/exit') { disconnect(); setInput(''); return }
    if (text === '/help') {
      setLines(prev => [...prev,
        { who: 'user', text },
        { who: 'sys', text: 'Comandos: /clear  /exit  /help' }
      ])
      setInput('')
      return
    }

    setLines(prev => [...prev, { who: 'user', text }])
    setInput('')
    setBusy(true)
    try {
      const reply = await sendMessage(text)
      setLines(prev => [...prev, { who: 'ai', text: reply }])
    } catch (err) {
      setLines(prev => [...prev, { who: 'err', text: 'ERR: ' + (err.message || 'fallo de transmisión') }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="crt">
      <div className="scanlines" />
      <div className="terminal">
        <div className="titlebar">
          <span className="dot red" /><span className="dot yel" /><span className="dot grn" />
          <span className="title">NEXUS://AI_TERMINAL_v2.4 — neural_link {connected ? 'ACTIVE' : 'STANDBY'}</span>
        </div>

        <div className="screen">
          {lines.map((l, i) => <Line key={i} who={l.who} text={l.text} />)}
          {busy && <div className="line ai"><span className="prefix">&gt; NEXUS://</span> <span className="blink">▓▓▓▓▓▓░░░░░ decoding...</span></div>}
          <div ref={endRef} />
        </div>

        {bootDone && !connected && (
          <div className="keyrow">
            <input
              type="password"
              placeholder="pega tu GEMINI_API_KEY aquí..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && connect()}
            />
            <button onClick={connect}>CONECTAR</button>
          </div>
        )}

        {connected && (
          <form className="prompt" onSubmit={handleSubmit}>
            <span className="prefix">&gt; USER@local:~$</span>
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={busy ? 'esperando respuesta...' : 'escribe un mensaje o /help'}
              disabled={busy}
            />
            <span className="cursor">_</span>
          </form>
        )}
      </div>
    </div>
  )
}
