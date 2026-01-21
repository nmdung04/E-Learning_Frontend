import { useRef, useState } from "react"

type RecorderProps = {
  wordId: number
}

export default function Recorder({ wordId }: RecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [recording, setRecording] = useState(false)
  const [hasRecord, setHasRecord] = useState(false)
  const [playing, setPlaying] = useState(false)

  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      const url = URL.createObjectURL(blob)

      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setPlaying(false)

      setHasRecord(true)
      setRecording(false)

      console.log("Recorded word:", wordId)
    }

    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecord = () => {
    mediaRecorderRef.current?.stop()
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="recorder">
      <button
        className={`mic-btn ${recording ? "recording" : ""}`}
        onClick={recording ? stopRecord : startRecord}
      >
        {recording ? "⏹" : "🎤"}
      </button>
      
      <button
        className="play-record-btn"
        onClick={togglePlay}
        disabled={!hasRecord}
      >
        {playing ? "⏸" : "🔊"}
      </button>
    </div>
  )
}
