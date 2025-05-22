# 📜 pengenalan dan resiko

Auto post atau posting otomatis adalah sebuah project dimana kamu bisa memposting kata ataupun
hal hal lainnya secara cepat dan efsien, ini mempermudahmu dalam berjualan online (misalnya),
resiko dari menggunakan project ini yaitu banned account, timeout dan sebagainya, bijaklah dalam menggunakan

---

## 📃 installasi

project ini memerlukan node.js dengan versi keatas (harap perbarui node.js kamu sebelum menggunakan)
kamu dapat menggunakan command ini untuk menginstallasi depedensi yang diperlukan
```
npm i
```

---
## ⚙️ Konfigurasi

contoh konfigurasi untuk bot discord
```
{
  "TOKEN": "", -- token bot discordmu
  "CLIENT_ID": "" -- client id, atau application id pada botmu
}
```
ini konfigurasi untuk db.json pertama kali
```js
{
  "configs": {}
}
```

ini sesudah diset menggunakan commands dari bot
```js
{
  "configs": {
    "": {
      "channels": [
        {
          "id": "",
          "message": "",
          "delay": 1,
          "token": ""
        }
      ],
      "logWebhook": "" // optional
    }
  }
}
```
---

## 🚀 Peluncuran

jalankan project ini dengan cara
```js
node index
```

---

## 🍵 Kontribusi dan issue

mohon sebanget bangetnya buat sepuh bisa banget kontribusi melalui

[ Kontribusi disini ]()

[ Issue disini ]()

---

> Selamat menggunakan :)
