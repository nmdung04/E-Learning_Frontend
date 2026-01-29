import { useState } from "react"
import IPAChart from "./components/IPAChart"
import VocabSection from "./components/VocabSection"
import { WORDS_MOCK } from "./data/words.mock"
import "./styles/speaking.css"

export default function SpeakingPage() {
  const [tab, setTab] = useState<"ipa" | "vocab">("ipa")

  return (
    <div className="speaking-page">
      {/* HEADER */}
      <div className="speaking-header">
        <h1>Speaking Practice</h1>

        <div className="tabs">
          <button
            className={`tab ${tab === "ipa" ? "active" : ""}`}
            onClick={() => setTab("ipa")}
          >
            🎧 Học âm
          </button>

          <button
            className={`tab ${tab === "vocab" ? "active" : ""}`}
            onClick={() => setTab("vocab")}
          >
            📘 Học từ vựng
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        {tab === "ipa" && <IPAChart key="ipa" />}

        {tab === "vocab" && (
          <VocabSection
            key="vocab"       // 🔥 QUAN TRỌNG
            words={WORDS_MOCK}
          />
        )}
      </div>
    </div>
  )
}
