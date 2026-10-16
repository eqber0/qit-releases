# qiT sürümleri

[qiT](https://github.com/eqber0/qit) araçlarının indirilebilir sürümleri. Kaynak kod deposu gizli; bu depo yalnızca
derlenmiş dosyaları ve güncelleme akışlarını (feed) barındırır.

| Uygulama | Ne yapar | Sürümler | Güncelleme akışı |
|---|---|---|---|
| **qliP** | Ekran görüntüsü, ekran kaydı, GIF, OCR | [`qlip-v*`](https://github.com/eqber0/qit-releases/releases?q=qlip-v) | [`feeds/qlip.json`](feeds/qlip.json) |
| **qriD** | Pencere yerleştirme | [`qrid-v*`](https://github.com/eqber0/qit-releases/releases?q=qrid-v) | [`feeds/qrid.json`](feeds/qrid.json) |

## Nasıl çalışır

- Her sürüm `<uygulama>-vX.Y.Z` etiketiyle bir GitHub Release'tir (ör. `qlip-v0.3.5`).
- Uygulamalar güncellemeyi sabit adresten okur:
  `https://raw.githubusercontent.com/eqber0/qit-releases/main/feeds/<uygulama>.json`.
- qiT CI'ı derlenen dosyaları deploy key ile `staging-<uygulama>` dalına iter. `publish` iş akışı dosyaları
  feed'deki sha256 değerleriyle doğrular, Release'i oluşturur, sonra `feeds/<uygulama>.json` dosyasını `main`'e yazar.

Yeni uygulama: qiT'de CI'ı `staging-<uygulama>` dalına iterse yeterli; bu depoda değişiklik gerekmez.
