/* eslint-disable @next/next/no-img-element */
import React from 'react'

export default function QRCodeBlock({ url, text, image }) {
  return (
    <section className="qrcode-block">
      {image && <img src={image} alt={text} />}
      <section className="qrcode-box">
        <section className="qrcode-text">
          <section className="qrcode-title">{text}</section>

          <section className="qrcode-url">{url}</section>
        </section>
        <div className="qrcode-img">
          <img
            width="90"
            height="90"
            src={`https://api.qrcode-monkey.com/qr/custom?size=90&data=${encodeURIComponent(
              url
            )}`}
            alt={text}
          />
        </div>
      </section>
    </section>
  )
}
