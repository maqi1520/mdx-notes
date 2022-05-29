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
            src={`/api/qrcode?url=${url}&type=image`}
            alt=""
          />
        </div>
      </section>
    </section>
  )
}
