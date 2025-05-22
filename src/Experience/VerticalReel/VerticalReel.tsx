import { extend, useTick } from "@pixi/react"
import { Container, Texture } from "pixi.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ANIMATION_DURATION, ANIMATION_DURATION_VARIATION, ANIMATION_SPIN_TIMES, REEL_AMOUNT_Y, REEL_ICON_DIMENSIONS } from "../../constants"
import { ReelSprite } from "../VerticalReel/ReelSprite"
import { Easing, Tween } from "@tweenjs/tween.js"

const VIRTUAL_REEL_AMOUNT_Y = REEL_AMOUNT_Y + 2 // invisible sprites added on both top and bottom

extend({ Container })

interface Props {
  reelTextures: Texture[]
  x?: number
  lastTimeAnimated?: number
}

export const VerticalReel: React.FC<Props> = ({ reelTextures, x, lastTimeAnimated }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [reelOffset, setReelOffset] = useState(0)

  const animationDuration = useMemo(() => ANIMATION_DURATION + ANIMATION_DURATION_VARIATION * Math.random(), [lastTimeAnimated])

  const tween = useMemo(() => new Tween({ y: 0 })
    .to({ y: REEL_ICON_DIMENSIONS.height * VIRTUAL_REEL_AMOUNT_Y * ANIMATION_SPIN_TIMES }, animationDuration)
    .easing(Easing.Back.InOut)
    .onUpdate((coord) => {
      setReelOffset(coord.y)
    })
    , [animationDuration])


  const onTick = useCallback(() => {
    if (isAnimating) {
      if (!tween.isPlaying()) {
        tween.start()
      }
      tween.update()
    } else if (tween.isPlaying()) {
      tween.stop()
    }
  }, [isAnimating, tween])

  useTick(onTick)

  useEffect(() => {
    if (lastTimeAnimated) {
      setIsAnimating(true)

      setTimeout(() => setIsAnimating(false), animationDuration)
    }
  }, [lastTimeAnimated, animationDuration])

  return <pixiContainer x={x}>
    {[...Array(VIRTUAL_REEL_AMOUNT_Y)].map((_, index) => {
      const topOffset = reelOffset + REEL_ICON_DIMENSIONS.height * index
      const virtualReelHeight = VIRTUAL_REEL_AMOUNT_Y * REEL_ICON_DIMENSIONS.height // total virtual reel height, includes invisible "buffer" sprite

      const y = -REEL_ICON_DIMENSIONS.height // top starting position, outside of the mask
        + (topOffset % virtualReelHeight)

      const timesTurned = Math.floor(topOffset / virtualReelHeight)

      return <ReelSprite
        key={index}
        textures={reelTextures}
        timesTurned={timesTurned}
        y={y}
      />
    }
    )}
  </pixiContainer>
}
