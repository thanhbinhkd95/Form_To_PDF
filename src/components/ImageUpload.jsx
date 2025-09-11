import { useRef, useState } from 'react'

function ImageUpload({ onChange, onReset, initialImage = null }) {
  const inputRef = useRef(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialImage)

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) {
      setImagePreviewUrl(null)
      onChange?.(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      // Validate minimal size ~ 240x320 and aspect ratio ~ 3/4
      const img = new Image()
      img.onload = () => {
        const w = img.width, h = img.height
        const ratio = w / h
        const okRatio = Math.abs(ratio - 3/4) < 0.05
        const okSize = w >= 240 && h >= 320
        setImagePreviewUrl(url)
        onChange?.(url)
        if (!okRatio || !okSize) {
          console.warn('Image ratio should be 3:4 and size ≥ 240x320')
        }
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  function handleReset() {
    setImagePreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ''
    onReset?.(null)
    onChange?.(null)
  }

  return (
    <div className="image-upload">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreviewUrl && (
        <div style={{ marginTop: 8 }}>
          <img src={imagePreviewUrl} alt="preview" style={{ width: 180, aspectRatio: '3/4', objectFit: 'cover', border: '1px solid var(--color-border)', borderRadius: 6 }} />
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>画像を削除/Delete photo</button>
      </div>
    </div>
  )
}

export default ImageUpload


