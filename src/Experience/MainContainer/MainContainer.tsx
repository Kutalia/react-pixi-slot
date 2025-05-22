import { extend } from "@pixi/react"
import { Assets, Container, Sprite, Text, Texture } from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { ANIMATION_DURATION, ANIMATION_DURATION_VARIATION, MAXIMUM_PRIZE, REEL_AMOUNT_X, REEL_AMOUNT_Y, REEL_ICON_DIMENSIONS } from "../../constants"
import { VerticalReel } from "../VerticalReel/VerticalReel"
import { numberFormat } from "../../helpers"

extend({ Container, Text, Sprite })

const basicAssets = import.meta.glob('../../assets/(minor|major)_(\\d+).png')

const maximumAnimationDuration = ANIMATION_DURATION + ANIMATION_DURATION_VARIATION

export const MainContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [reelTextures, setReelTextures] = useState<Texture[]>()
  const [lastTimeAnimated, setLastTimeAnimated] = useState<number>()
  const [animating, setAnimating] = useState(false)
  const [wonPrize, setWonPrize] = useState<number | null>(null)

  const maskRef = useRef<any>(null)

  useEffect(() => {
    const loadbasicAssets = async () => {
      const assetModulePromises = (Object.values(basicAssets) as any).map((fn: () => Promise<string>) => fn())
      const assetModules = await Promise.all(assetModulePromises)
      const assetUrls = assetModules.map((mod) => mod.default)
      const textures = await Assets.load(assetUrls)
      setReelTextures(Object.values(textures))
    }

    loadbasicAssets()
  }, [])

  const handleSpin = useCallback(() => {
    setLastTimeAnimated(Date.now())
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      setWonPrize(
        Math.random() > 0.7
        ? Math.round(Math.random() * MAXIMUM_PRIZE)
        : 0
      )
    }, maximumAnimationDuration)
  }, [])

  return (
    <pixiContainer>
      <pixiContainer mask={maskRef?.current}>
        {reelTextures && [...Array(REEL_AMOUNT_X)].map((_, index) =>
          <VerticalReel
            key={index}
            reelTextures={reelTextures}
            x={REEL_ICON_DIMENSIONS.width * index}
            lastTimeAnimated={lastTimeAnimated}
          />
        )}
        <pixiSprite
          texture={Texture.WHITE}
          width={REEL_AMOUNT_X * REEL_ICON_DIMENSIONS.width}
          height={REEL_AMOUNT_Y * REEL_ICON_DIMENSIONS.height}
          ref={maskRef}
        />
      </pixiContainer>
      {!animating && <pixiText
        text="Spin the reel!"
        y={700} x={700} style={{ fill: '#fff', fontSize: 40 }}
        eventMode="static"
        onClick={handleSpin}
      />}
      {typeof wonPrize === 'number' && <pixiText
        text={wonPrize > 0 ? `You have won ${numberFormat.format(wonPrize)}!!!` : 'Sadly, no winning, try again'}
        y={700} x={50} style={{ fill: wonPrize > 0 ? 'blue' : 'red', fontSize: 40 }}
      />}
      {children}
    </pixiContainer>
  )
}