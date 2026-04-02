import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

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

  // ローカル state（スムーズな入力用）
  const [awayName, setAwayName] = useState(awayTeam.name)
  const [awayShort, setAwayShort] = useState(awayTeam.shortName)
  const [homeName, setHomeName] = useState(homeTeam.name)
  const [homeShort, setHomeShort] = useState(homeTeam.shortName)
  const [awayColor, setAwayColor] = useState(awayTeam.color)
  const [homeColor, setHomeColor] = useState(homeTeam.color)

  // ストア側が変わったらローカル state を追従（IDB復元・newGame 等）
  useEffect(() => { setAwayName(awayTeam.name) }, [awayTeam.name])
  useEffect(() => { setAwayShort(awayTeam.shortName) }, [awayTeam.shortName])
  useEffect(() => { setHomeName(homeTeam.name) }, [homeTeam.name])
  useEffect(() => { setHomeShort(homeTeam.shortName) }, [homeTeam.shortName])
  useEffect(() => { setAwayColor(awayTeam.color) }, [awayTeam.color])
  useEffect(() => { setHomeColor(homeTeam.color) }, [homeTeam.color])

  /** ローカル state → ストアに反映 */
  const applyTeams = () => {
    setTeamName('away', awayName, awayShort)
    setTeamName('home', homeName, homeShort)
    setTeamColor('away', awayColor)
    setTeamColor('home', homeColor)
  }

  /** 入力欄からフォーカスが外れたら自動でストアに反映（ボタン押し忘れ防止） */
  const handleBlur = () => { applyTeams() }

  const handleNewGame = () => {
    if (confirm('新しい試合を開始しますか？全データがリセットされます。')) {
      newGame()
    }
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
          <input
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="略称（2-3文字）"
            value={awayShort}
            onChange={(e) => setAwayShort(e.target.value)}
            onBlur={handleBlur}
            maxLength={4}
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
          <input
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="略称（2-3文字）"
            value={homeShort}
            onChange={(e) => setHomeShort(e.target.value)}
            onBlur={handleBlur}
            maxLength={4}
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

      {/* オーバーレイ パネルサイズ・位置 */}
      <div className="space-y-2 pt-2 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm whitespace-nowrap">パネルサイズ</span>
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
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">パネル配置</span>
          <button
            onClick={resetOverlayPositions}
            className="bg-gray-600 hover:bg-gray-500 text-gray-300 px-3 py-1.5 rounded text-xs font-bold"
          >
            位置をリセット
          </button>
        </div>
      </div>

      {isGameOver && (
        <div className="bg-red-900/50 border border-red-500 rounded p-2 text-red-300 text-sm text-center">
          試合終了
        </div>
      )}
    </div>
  )
}
