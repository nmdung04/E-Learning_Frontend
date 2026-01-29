export type IpaSymbol = {
  symbol: string;
  label: string;
  audio: string;
};

export const IPA_VOWELS: IpaSymbol[] = [
  { symbol: "/iː/", label: "long i", audio: "/audio/ipa/i-long.mp3" },
  { symbol: "/ɪ/", label: "short i", audio: "/audio/ipa/i-short.mp3" },
  { symbol: "/e/", label: "e", audio: "/audio/ipa/e.mp3" },
  { symbol: "/æ/", label: "ae", audio: "/audio/ipa/ae.mp3" },

  { symbol: "/ɑː/", label: "long a", audio: "/audio/ipa/a-long.mp3" },
  { symbol: "/ʌ/", label: "uh", audio: "/audio/ipa/uh.mp3" },
  { symbol: "/ɔː/", label: "aw", audio: "/audio/ipa/aw.mp3" },
  { symbol: "/ɒ/", label: "short o", audio: "/audio/ipa/o-short.mp3" },

  { symbol: "/ʊ/", label: "short u", audio: "/audio/ipa/u-short.mp3" },
  { symbol: "/uː/", label: "long u", audio: "/audio/ipa/u-long.mp3" },

  { symbol: "/ə/", label: "schwa", audio: "/audio/ipa/schwa.mp3" },
  { symbol: "/ɜː/", label: "er", audio: "/audio/ipa/er.mp3" },
];

export const IPA_CONSONANTS: IpaSymbol[] = [
  { symbol: "/p/", label: "p", audio: "/audio/ipa/p.mp3" },
  { symbol: "/b/", label: "b", audio: "/audio/ipa/b.mp3" },
  { symbol: "/t/", label: "t", audio: "/audio/ipa/t.mp3" },
  { symbol: "/d/", label: "d", audio: "/audio/ipa/d.mp3" },
  { symbol: "/k/", label: "k", audio: "/audio/ipa/k.mp3" },
  { symbol: "/g/", label: "g", audio: "/audio/ipa/g.mp3" },

  { symbol: "/f/", label: "f", audio: "/audio/ipa/f.mp3" },
  { symbol: "/v/", label: "v", audio: "/audio/ipa/v.mp3" },
  { symbol: "/θ/", label: "th (thin)", audio: "/audio/ipa/th-voiceless.mp3" },
  { symbol: "/ð/", label: "th (this)", audio: "/audio/ipa/th-voiced.mp3" },
  { symbol: "/s/", label: "s", audio: "/audio/ipa/s.mp3" },
  { symbol: "/z/", label: "z", audio: "/audio/ipa/z.mp3" },
  { symbol: "/ʃ/", label: "sh", audio: "/audio/ipa/sh.mp3" },
  { symbol: "/ʒ/", label: "zh", audio: "/audio/ipa/zh.mp3" },
  { symbol: "/h/", label: "h", audio: "/audio/ipa/h.mp3" },

  { symbol: "/tʃ/", label: "ch", audio: "/audio/ipa/ch.mp3" },
  { symbol: "/dʒ/", label: "j", audio: "/audio/ipa/j.mp3" },

  { symbol: "/m/", label: "m", audio: "/audio/ipa/m.mp3" },
  { symbol: "/n/", label: "n", audio: "/audio/ipa/n.mp3" },
  { symbol: "/ŋ/", label: "ng", audio: "/audio/ipa/ng.mp3" },

  { symbol: "/l/", label: "l", audio: "/audio/ipa/l.mp3" },
  { symbol: "/r/", label: "r", audio: "/audio/ipa/r.mp3" },
  { symbol: "/j/", label: "y", audio: "/audio/ipa/y.mp3" },
  { symbol: "/w/", label: "w", audio: "/audio/ipa/w.mp3" },
];
