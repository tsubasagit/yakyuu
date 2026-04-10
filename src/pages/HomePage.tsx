import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">yakyuu</h1>
          <p className="text-slate-400 text-lg">
            野球ライブ配信用スコアボードオーバーレイ
          </p>
          <p className="text-slate-500 text-sm mt-2">OBSブラウザソース対応 / サーバー不要 / 無料</p>
          <p className="text-slate-600 text-xs mt-3">v0.2.0</p>
        </div>

        {/* リンクカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/control"
            className="block bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2 text-[#538bb0]">コントロールパネル</h2>
            <p className="text-slate-400 text-sm">
              スコアキーパー用の操作画面。チーム・選手・スコア・カウントをリアルタイムに操作できます。
            </p>
          </Link>
          <Link
            to="/overlay"
            className="block bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2 text-yellow-400">オーバーレイ</h2>
            <p className="text-slate-400 text-sm">
              OBSブラウザソース用。透明背景のスコアボードを配信映像に重ねて表示します。
            </p>
          </Link>
        </div>

        {/* 機能概要 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">機能</h2>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>- イニング別スコア（9回＋延長対応）</li>
            <li>- BSO（ボール・ストライク・アウト）カウント</li>
            <li>- 走者ダイヤモンド表示</li>
            <li>- 打順カード（打率・HR・打点・OPS）</li>
            <li>- 投手情報（登板数・勝敗・投球数）</li>
            <li>- 演出エフェクト（ホームラン・三振）</li>
            <li>- テロップ・ティッカー表示</li>
            <li>- BroadcastChannel APIによるタブ間リアルタイム同期</li>
          </ul>
        </div>

        {/* OBS セットアップガイド */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">OBS セットアップ</h2>
          <div className="space-y-4 text-sm">
            <a
              href="guide.html"
              className="block bg-[#538bb0]/10 hover:bg-[#538bb0]/20 border-2 border-[#538bb0] rounded-xl p-5 transition-colors text-center"
            >
              <span className="text-[#538bb0] font-bold text-lg block mb-1">OBS セットアップガイド</span>
              <span className="text-slate-400 text-sm">スクリーンショット・操作デモ動画付きの詳細ガイド →</span>
            </a>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-[#538bb0] mb-2">Step 1: カスタムドックを追加（コントロール画面）</h3>
              <p className="text-slate-300 mb-2">OBSメニュー「<strong className="text-white">ドック</strong>」→「<strong className="text-white">カスタムブラウザドック</strong>」で以下を設定：</p>
              <ul className="text-slate-400 space-y-1 ml-4">
                <li>- ドック名: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-xs text-slate-200">yakyuu</code></li>
                <li>- URL: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-xs text-slate-200">{window.location.origin + window.location.pathname}#/control</code></li>
              </ul>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-yellow-400 mb-2">Step 2: ブラウザソースを追加（オーバーレイ）</h3>
              <p className="text-slate-300 mb-2">OBSの「ソース」→「ブラウザ」で以下を設定：</p>
              <ul className="text-slate-400 space-y-1 ml-4">
                <li>- URL: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-xs text-slate-200">{window.location.origin + window.location.pathname}#/overlay</code></li>
                <li>- 幅: <strong className="text-white">1920</strong>　高さ: <strong className="text-white">1080</strong></li>
                <li>- カスタムCSS: <strong className="text-red-400">空欄にする</strong>（デフォルトCSSを削除）</li>
              </ul>
            </div>
            <p className="text-yellow-400/80 text-xs">
              ※ カスタムドックとブラウザソースはOBS内で同じブラウザエンジン（CEF）を共有するため、リアルタイム同期が可能です。Chrome等の外部ブラウザとは同期できません。
            </p>
          </div>
        </div>

        {/* 技術スタック */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">技術スタック</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'BroadcastChannel API', 'GitHub Pages'].map((tech) => (
              <span key={tech} className="bg-slate-800 border border-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 更新履歴 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">更新履歴</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#538bb0] font-bold">v0.2.0</span>
                <span className="text-slate-500 text-xs">2026-04-04</span>
              </div>
              <p className="text-slate-300 mb-2">OBS Custom Dock + Browser Source での安定動作を実現。パネル配置の個別調整に対応。</p>
              <div className="mb-2">
                <p className="text-emerald-400 text-xs font-bold mb-1">新機能</p>
                <ul className="text-slate-400 space-y-0.5 ml-3 text-xs">
                  <li>- 「前の打者」ボタン（打順の巻き戻し）</li>
                  <li>- コントロールパネルのセクション並び替え機能</li>
                  <li>- コントロールパネル 2カラムレイアウト</li>
                  <li>- 打順パネルを両チーム同時表示</li>
                  <li>- CSVインポート機能（打順・選手データ）</li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-400 text-xs font-bold mb-1">不具合修正</p>
                <ul className="text-slate-400 space-y-0.5 ml-3 text-xs">
                  <li>- チーム名がオーバーレイに反映されない問題を修正</li>
                  <li>- OBS再起動後にデータが初期化される問題を修正</li>
                  <li>- オーバーレイのパネルドラッグ時に画面が点滅する問題を修正</li>
                  <li>- コントロールパネルの接続ステータスが誤って「未接続」になる問題を修正</li>
                  <li>- 打順・投手のチーム切り替えがオーバーレイに反映されない問題を修正</li>
                </ul>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#538bb0] font-bold">v0.1.0</span>
                <span className="text-slate-500 text-xs">2026-03-17</span>
              </div>
              <p className="text-slate-300">初回リリース。スコアボード・BSO・走者・打順カード・投手情報・演出エフェクト・BroadcastChannel同期。</p>
            </div>
          </div>
        </div>

        {/* 問い合わせ CTA */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-[#538bb0]/30 rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold text-[#538bb0] mb-2">カスタマイズ・導入サポート</h2>
            <p className="text-slate-400 text-sm mb-4">
              チームロゴの追加、配信画面デザイン、OBSセットアップ代行など、お気軽にご相談ください。
            </p>
            <a
              href="https://share-na2.hsforms.com/2T1pQ6j2sQzajdd3AIDeWqgcy93d?utm_source=https://tsubasagit.github.io/yakyuu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#538bb0] hover:bg-[#3d6f94] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              お問い合わせはこちら
            </a>
            <p className="text-slate-600 text-xs mt-2">AppTalentHub Inc.</p>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center text-slate-500 text-sm border-t border-slate-700 pt-6">
          <p>
            <a
              href="https://github.com/tsubasagit/yakyuu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#538bb0] hover:underline"
            >
              GitHub
            </a>
            {' '}/{' '}
            <a
              href="https://github.com/tsubasagit/yakyuu/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#538bb0] hover:underline"
            >
              ご質問・不具合報告
            </a>
            {' '}/{' '}
            <a
              href="https://apptalenthub.co.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#538bb0] hover:underline"
            >
              AppTalentHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
