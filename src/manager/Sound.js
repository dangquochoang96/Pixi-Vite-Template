import { sound } from "@pixi/sound"
import gsap from "gsap"

/**
 * Handles music background, playing only one audio file in loop at time,
 * and fade/stop the music if a new one is requested. Also provide volume
 * control for music background only, leaving other sounds volumes unchanged.
 */
class BGM {
  /** Current volume set */
  volume = 1

  /** Play a background music, fading out and stopping the previous, if there is one */
  async play(alias, options) {
    // Do nothing if the requested music is already being played
    if (this.currentAlias === alias) return

    // Fade out then stop current music
    if (this.current) {
      const current = this.current
      gsap.killTweensOf(current)
      gsap.to(current, { volume: 0, duration: 1, ease: "linear" }).then(() => {
        current.stop()
      })
    }

    // Find out the new instance to be played
    this.current = sound.find(alias)

    // Play and fade in the new music
    this.currentAlias = alias
    this.current.play({ loop: true, ...options })
    this.current.volume = 0
    gsap.killTweensOf(this.current)
    gsap.to(this.current, { volume: this.volume, duration: 1, ease: "linear" })
  }

  /** Get background music volume */
  getVolume() {
    return this.volume
  }

  /** Set background music volume */
  setVolume(v) {
    this.volume = v
    if (this.current) this.current.volume = this.volume
  }
}

/**
 * Handles short sound special effects, mainly for having its own volume settings.
 * The volume control is only a workaround to make it work only with this type of sound,
 * with a limitation of not controlling volume of currently playing instances - only the new ones will
 * have their volume changed. But because most of sound effects are short sounds, this is generally fine.
 */
class SFX {
  /** Volume scale for new instances */
  volume = 1

  /** Play an one-shot sound effect */
  play(alias, options) {
    const volume = this.volume * (options?.volume ?? 1)
    sound.play(alias, { ...options, volume })
  }

  /** Set sound effects volume */
  getVolume() {
    return this.volume
  }

  /** Set sound effects volume. Does not affect instances that are currently playing */
  setVolume(v) {
    this.volume = v
  }
}

/** Get overall sound volume */
export function getMasterVolume() {
  return sound.volumeAll
}

/** Set the overall sound volume, affecting all music and sound effects */
export function setMasterVolume(v) {
  sound.volumeAll = v
  if (!v) {
    sound.muteAll()
  } else {
    sound.unmuteAll()
  }
}
/** Shared background music controller */
export const bgm = new BGM()

/** Shared sound effects controller */
export const sfx = new SFX()
