/** 全 DraggableBox 共有のドラッグ中フラグ。
 *  ドラッグ中は BroadcastSync / StorageSync の replaceState を
 *  スキップし、パネル点滅を防ぐ。
 *  独立モジュールにすることで循環依存を回避する。 */
let _active = false

export function setGlobalDragActive(active: boolean) { _active = active }
export function isGlobalDragActive() { return _active }
