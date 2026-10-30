"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23, 440, 587.33, 440, 349.23];
const noLabels = [
  "Nope",
  "Hahahahaha",
  "Aray mo",
  "Meow",
  "Bleh",
  "Bawal",
  "Yes lang dapat"
];

function Cat() {
  return <div className="cat"><span className="eyes"><i /><i /></span><span className="collar"><i /></span><span className="tail" /></div>;
}

function CelebrationCat({ size }) {
  return (
    <div className={`celebrationCat ${size}`}>
      <span className="brownSpot spotOne" /><span className="brownSpot spotTwo" />
      <span className="celebrationEyes"><i /><i /></span>
      <span className="celebrationNose" /><span className="celebrationTail" />
    </div>
  );
}

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [dodges, setDodges] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const noteRef = useRef(0);

  const playNote = () => {
    const context = audioRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[noteRef.current++ % notes.length];
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.48);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  };

  const setMusic = (next) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioRef.current) audioRef.current = new AudioContext();
    clearInterval(timerRef.current);
    setMusicOn(next);
    if (next) {
      audioRef.current.resume();
      playNote();
      timerRef.current = setInterval(playNote, 520);
    }
  };

  const dodge = (event) => {
    event?.preventDefault();
    const width = event?.currentTarget?.offsetWidth || 110;
    const height = event?.currentTarget?.offsetHeight || 54;
    const padding = 18;
    setDodges(value => value + 1);
    setNoPosition({
      left: padding + Math.random() * Math.max(0, window.innerWidth - width - padding * 2),
      top: 70 + Math.random() * Math.max(0, window.innerHeight - height - 90),
      rotate: (Math.random() - 0.5) * 18
    });
  };

  useEffect(() => () => {
    clearInterval(timerRef.current);
    audioRef.current?.close();
  }, []);

  const acceptDate = async () => {
    if (saving || accepted) return;
    setSaving(true);
    setSaveError("");
    setMusic(true);
    try {
      const { error } = await supabase.from("date_responses").insert({ answer: "yes" });
      if (error) throw error;
      setAccepted(true);
    } catch {
      setSaveError("I couldn’t save your answer. Please try once more.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="sky" aria-hidden="true">
        <div className="moon" />
        <b className="star starOne">✦</b><b className="star starTwo">✧</b>
        <b className="star starThree">✦</b><b className="star starFour">✧</b>
      </div>
      <button className="music" aria-label={`Turn music ${musicOn ? "off" : "on"}`} onClick={() => setMusic(!musicOn)}>{musicOn ? "♫" : "♪"}</button>
      <main onPointerDown={() => { if (!audioRef.current) setMusic(true); }}>
        <section className="card" aria-labelledby="question">
          <span className="paw pawOne">🐾</span><span className="paw pawTwo">🐾</span>
          <h1 id="question">Henlo, <span>Joana</span><br />Will you go out on a date with me this ...</h1>
          <p className="sub">With trixie's blessing</p>
          <div className="cats" aria-hidden="true">
            <div className="catLabel">
              <span>Trixie</span>
              <svg viewBox="0 0 100 55" role="presentation">
                <path d="M8 7 C 24 42, 58 48, 88 30" />
                <path d="M76 28 L 89 30 L 84 42" />
              </svg>
            </div>
            <Cat />
          </div>
          <div className="actions">
            <button className="yes" onClick={acceptDate} disabled={saving}>{saving ? "Saving…" : "Yes! 🖤"}</button>
            <button
              className="no"
              style={noPosition ? { position: "fixed", left: noPosition.left, top: noPosition.top, transform: `rotate(${noPosition.rotate}deg)` } : undefined}
              onPointerEnter={dodge} onPointerDown={dodge} onFocus={dodge} onClick={dodge}
            >{noLabels[dodges % noLabels.length]}</button>
          </div>
          {saveError && <p className="saveError" role="alert">{saveError}</p>}
          <div className={`success ${accepted ? "show" : ""}`} role="status" aria-live="polite">
            <div><div className="celebrationCats" aria-hidden="true"><CelebrationCat size="big" /><CelebrationCat size="small" /></div><h2>Yahoooo</h2><p>Cotton and Ash hapi :D</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
