import { extend, PixiReactElementProps } from "@pixi/react"
import { Sprite, Texture } from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { REEL_ICON_DIMENSIONS } from "../../constants"

extend({ Sprite })

interface Props extends PixiReactElementProps<typeof Sprite> {
  textures: Texture[]
  timesTurned?: number
}

export const ReelSprite: React.FC<Props> = ({ textures, timesTurned, ...rest }) => {
  const getRandomTexture = useCallback(
    () => textures[Math.round(Math.random() * (textures.length - 1))]
    , [textures])

  const lastTexture = useRef<Texture>(null)
    
  const [texture, setTexture] = useState(getRandomTexture)

  useEffect(() => {
    let texture: Texture

    if (!timesTurned && lastTexture.current) {
      texture = lastTexture.current
    } else {
      texture = getRandomTexture()
    }

    setTexture(texture)
    lastTexture.current = texture
  }, [timesTurned, getRandomTexture])

  return <pixiSprite
    {...rest}
    texture={texture}
    width={REEL_ICON_DIMENSIONS.width}
    height={REEL_ICON_DIMENSIONS.height}
  />
}
