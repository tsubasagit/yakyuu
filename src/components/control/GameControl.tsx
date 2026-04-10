import { useEffect, useState, useCallback } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { extractGameState } from '../../store/useGameStore'
import { generateGameRecordHTML } from '../../lib/gameRecordExport'
import type { OverlayPosition } from '../../types'
import { DEFAULT_OVERLAY_POSITIONS } from '../../types'

const PANEL_LABELS: Record<string, string> = {
  scoreboard: 'スコアボード',
  timer: 'タイマー',
  lineup: '打順カード',
  playerInfo: '選手情報',
  playLog: '経過ログ',
  mascot: 'マスコット',
}

const PANEL_IDS = Object.keys(PANEL_LABELS)

export default function GameControl() {
  const awayTeam = useGameStore((s) => s.awayTeam)
  const homeTeam = useGameStore((s) => s.homeTeam)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const setTeamName = useGameStore((s) => s.setTeamName)
  const setGameOver = useGameStore((s) => s.setGameOver)
  const newGame = useGameStore((s) => s.newGame)
  const gameStartTime = useGameStore((s) => s.gameStartTime)
  const startGameTimer = useGameStore((s) => s.startGameTimer)
  const stopGameTimer = useGameStore((s) => s.stopGameTimer)
  const setTeamColor = useGameStore((s) => s.setTeamColor)
  const showWaitingScreen = useGameStore((s) => s.showWaitingScreen)
  const setShowWaitingScreen = useGameStore((s) => s.setShowWaitingScreen)
  const resetOverlayPositions = useGameStore((s) => s.resetOverlayPositions)
  const overlayScale = useGameStore((s) => s.overlayScale ?? 1)
  const setOverlayScale = useGameStore((s) => s.setOverlayScale)
  const overlayPositions = useGameStore((s) => s.overlayPositions)
  const setOverlayPosition = useGameStore((s) => s.setOverlayPosition)
  const [panelOpen, setPanelOpen] = useState(false)

  const updatePanelField = useCallback(
    (id: string, field: keyof OverlayPosition, value: number) => {
      setOverlayPosition(id, { [field]: value })
    },
    [setOverlayPosition],
  )

  // ローカル state（スムーズな入力用）
  const [awayName, setAwayName] = useState(awayTeam.name)
  const [homeName, setHomeName] = useState(homeTeam.name)
  const [awayColor, setAwayColor] = useState(awayTeam.color)
  const [homeColor, setHomeColor] = useState(homeTeam.color)

  // ストア側が変わったらローカル state を追従（IDB復元・newGame 等）
  useEffect(() => { setAwayName(awayTeam.name) }, [awayTeam.name])
  useEffect(() => { setHomeName(homeTeam.name) }, [homeTeam.name])
  useEffect(() => { setAwayColor(awayTeam.color) }, [awayTeam.color])
  useEffect(() => { setHomeColor(homeTeam.color) }, [homeTeam.color])

  /** ローカル state → ストアに反映（name を shortName にも使用） */
  const applyTeams = () => {
    setTeamName('away', awayName, awayName)
    setTeamName('home', homeName, homeName)
    setTeamColor('away', awayColor)
    setTeamColor('home', homeColor)
  }

  /** 入力欄からフォーカスが外れたら自動でストアに反映 */
  const handleBlur = () => { applyTeams() }

  // デバウンス付き自動反映: OBS Dock では blur が発火しないケースがあるため、
  // 入力変更 500ms 後にストアへ自動反映する
  useEffect(() => {
    const timer = setTimeout(() => {
      setTeamName('away', awayName, awayName)
      setTeamName('home', homeName, homeName)
    }, 500)
    return () => clearTimeout(timer)
  }, [awayName, homeName, setTeamName])

  const handleNewGame = () => {
    if (confirm('新しい試合を開始しますか？全データがリセットされます。')) {
      newGame()
    }
  }

  const handleExportRecord = () => {
    const state = extractGameState(useGameStore.getState())
    const html = generateGameRecordHTML(state)
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `試合記録_${awayTeam.name}_vs_${homeTeam.name}_${new Date().toISOString().slice(0, 10)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h2 className="text-white font-bold text-lg">試合管理</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-gray-400 text-xs">アウェイ（先攻）</label>
          <input
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="チーム名"
            value={awayName}
            onChange={(e) => setAwayName(e.target.value)}
            onBlur={handleBlur}
          />
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-xs">カラー</label>
            <input
              type="color"
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              value={awayColor}
              onChange={(e) => { setAwayColor(e.target.value); setTeamColor('away', e.target.value) }}
            />
            <span className="text-gray-500 text-xs font-mono">{awayColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-gray-400 text-xs">ホーム（後攻）</label>
          <input
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="チーム名"
            value={homeName}
            onChange={(e) => setHomeName(e.target.value)}
            onBlur={handleBlur}
          />
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-xs">カラー</label>
            <input
              type="color"
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              value={homeColor}
              onChange={(e) => { setHomeColor(e.target.value); setTeamColor('home', e.target.value) }}
            />
            <span className="text-gray-500 text-xs font-mono">{homeColor}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyTeams}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded text-sm font-bold"
        >
          チーム名を反映
        </button>
        <button
          onClick={() => setGameOver(!isGameOver)}
          className={`px-4 py-2 rounded text-sm font-bold ${
            isGameOver
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isGameOver ? '試合再開' : '試合終了'}
        </button>
        <button
          onClick={handleNewGame}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold"
        >
          新規試合
        </button>
        <button
          onClick={handleExportRecord}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold"
        >
          試合記録
        </button>
      </div>

      {/* 待機画面 */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
        <span className="text-gray-400 text-sm">待機画面</span>
        <button
          onClick={() => setShowWaitingScreen(!showWaitingScreen)}
          className={`px-4 py-2 rounded text-sm font-bold ${
            showWaitingScreen
              ? 'bg-accent hover:bg-accent/80 text-white'
              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
          }`}
        >
          {showWaitingScreen ? '表示中' : '表示する'}
        </button>
        {showWaitingScreen && (
          <span className="text-accent text-xs">タイマー開始で自動非表示</span>
        )}
      </div>

      {/* タイマー */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
        <span className="text-gray-400 text-sm">経過時間</span>
        {gameStartTime ? (
          <button
            onClick={stopGameTimer}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-bold"
          >
            タイマー停止
          </button>
        ) : (
          <button
            onClick={startGameTimer}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold"
          >
            タイマー開始
          </button>
        )}
        {gameStartTime && (
          <span className="text-green-400 text-xs animate-pulse">計測中</span>
        )}
      </div>

      {/* パネルサイズ調整 */}
      <div className="bg-gray-700/50 rounded-lg p-3 space-y-3 border border-accent/30">
        <h3 className="text-accent font-bold text-sm">パネルサイズ調整</h3>

        <div className="flex items-center gap-3">
          <span className="text-white text-xs font-bold whitespace-nowrap">全体</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={overlayScale}
            onChange={(e) => setOverlayScale(parseFloat(e.target.value))}
            className="flex-1 accent-accent"
          />
          <span className="text-white text-sm font-mono w-12 text-right">
            {overlayScale.toFixed(1)}x
          </span>
          <button
            onClick={() => setOverlayScale(1)}
            className="bg-gray-600 hover:bg-gray-500 text-gray-300 px-2 py-1 rounded text-xs"
          >
            1x
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
          >
            <span>{panelOpen ? '▼' : '▶'}</span>
            個別パネル設定
          </button>
          <button
            onClick={resetOverlayPositions}
            className="bg-gray-600 hover:bg-gray-500 text-gray-300 px-3 py-1.5 rounded text-xs font-bold"
          >
            全リセット
          </button>
        </div>

        {panelOpen && (
          <div className="space-y-2 bg-gray-800/50 rounded p-2">
            {PANEL_IDS.map((id) => {
              const pos = overlayPositions?.[id]
              const def = DEFAULT_OVERLAY_POSITIONS[id] ?? { x: 0, y: 0 }
              const x = pos?.x ?? def.x
              const y = pos?.y ?? def.y
              const sc = pos?.scale ?? 1
              return (
                <div key={id} className="space-y-1 border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-accent text-xs font-bold">{PANEL_LABELS[id]}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <label className="text-gray-400 text-[10px] font-bold">X</label>
                    <input
                      type="number"
                      value={x}
                      onChange={(e) => updatePanelField(id, 'x', parseInt(e.target.value) || 0)}
                      className="w-16 bg-gray-700 text-white rounded px-1.5 py-1 text-xs font-mono text-right"
                    />
                    <label className="text-gray-400 text-[10px] font-bold">Y</label>
                    <input
                      type="number"
                      value={y}
                      onChange={(e) => updatePanelField(id, 'y', parseInt(e.target.value) || 0)}
                      className="w-16 bg-gray-700 text-white rounded px-1.5 py-1 text-xs font-mono text-right"
                    />
                    <label className="text-gray-400 text-[10px] font-bold">倍率</label>
                    <input
                      type="number"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={sc}
                      onChange={(e) => updatePanelField(id, 'scale', parseFloat(e.target.value) || 1)}
                      className="w-14 bg-gray-700 text-white rounded px-1.5 py-1 text-xs font-mono text-right"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="bg-red-900/50 border border-red-500 rounded p-2 text-red-300 text-sm text-center">
          試合終了
        </div>
      )}
    </div>
  )
}
