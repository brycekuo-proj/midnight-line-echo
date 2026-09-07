# ECHO Telemetry v1

目的：公開測試時量化玩家「有沒有開始、玩到哪一章、在哪裡離開、各章節/小遊戲花多久、最後到達哪個結局」，並比較 Facebook / Dcard / PTT / Reddit 等來源。

## 收集範圍

玩家版才記錄；`engineering.html` 不送正式統計。

事件：

- `game_open`：玩家頁被打開。
- `game_start`：按下「進入 ECHO」。
- `level_start`：章節開始。
- `level_end`：章節完成，附 `duration_sec`、`chapter_sync`、`total_sync`。
- `level_exit`：章節未完成就離開/被替換。
- `minigame_start`：小遊戲開始。
- `minigame_complete`：小遊戲完成。
- `minigame_exit`：小遊戲取消/未完成。
- `minigame_retry`：重開同一小遊戲，或小遊戲結果回報 mistakes / attempts 時記錄重試量。
- `ending_reached`：抵達結局。
- `play_time`：頁面隱藏或離開時送出有效遊玩秒數增量與累積值。
- `progress_reset`：玩家清除進度。

## 匿名識別

- `echo_telemetry_player_id`：瀏覽器 localStorage 產生的隨機匿名 ID。
- `echo_telemetry_session_id`：每個分頁 sessionStorage 的隨機 session ID。
- 不收姓名、Email、Facebook 帳號或玩家輸入文字。

## 來源追蹤

支援 UTM：`utm_source`、`utm_medium`、`utm_campaign`、`utm_content`、`utm_term`。

每次造訪會記 `source / medium / campaign`；另外保存第一次造訪的 `first_source / first_medium`。

範例：

- Facebook：`?utm_source=facebook&utm_medium=social&utm_campaign=echo_beta`
- Dcard：`?utm_source=dcard&utm_medium=forum&utm_campaign=echo_beta`
- PTT：`?utm_source=ptt&utm_medium=forum&utm_campaign=echo_beta`
- Reddit：`?utm_source=reddit&utm_medium=forum&utm_campaign=echo_beta`

## GA4 啟用

目前程式已支援 GA4，但正式上傳只有在玩家頁 `<head>` 內的設定填入有效 Measurement ID 才會啟用：

```html
<meta name="echo-ga4-id" content="G-4CC46M98D0">
```

ID 空白時不會連線 Google Analytics；事件仍會寫入本機 debug ring buffer，方便先 QA。

## 本機 QA

網址加 `?echo_debug=1` 後，事件會在 Console 顯示。

Console 可用：

```js
EchoTelemetry.status()
EchoTelemetry.debugEvents()
```

`EchoTelemetry.status()` 可確認目前來源、匿名 ID、session、GA4 是否啟用與所在章節。

## 結局 ID

- `normal_offline`：假/Normal End《離線》
- `mid_loop_online`：中同步《循環在線》
- `high_forever`：高同步《永遠在一起》
- `high_forever_100`：100% 高同步
- `origin_complete`：番外篇完成
- `fallback_echo`：第五章保底結算（理論上不應成為主要路徑）

## 公開測試前

正式啟用 GA4 後，公開頁面應補上簡短的匿名分析/隱私說明，清楚告知會收集關卡進度、遊玩時間與來源；不要把聊天內容、姓名、Email 或其他可識別資訊加入 telemetry event。
