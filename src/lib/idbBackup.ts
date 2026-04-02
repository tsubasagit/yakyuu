/**
 * IndexedDB バックアップストレージ。
 *
 * OBS の Custom Browser Dock は再起動時に localStorage がクリアされることがある。
 * Zustand の persist ミドルウェアが localStorage に書き込むタイミングで
 * IndexedDB にも同じデータをバックアップし、次回起動時に localStorage が空なら
 * IndexedDB から復元する。
 */

const DB_NAME = 'yakyuu-backup'
const STORE_NAME = 'state'
const KEY = 'game-state'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** localStorage の persist データを IndexedDB にもバックアップする */
export async function backupToIDB(raw: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(raw, KEY)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    // IndexedDB 非対応環境では無視
  }
}

/** IndexedDB からバックアップを復元する（localStorage が空の場合に使用） */
export async function restoreFromIDB(): Promise<string | null> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(KEY)
    const result = await new Promise<string | null>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
    })
    db.close()
    return result
  } catch {
    return null
  }
}
