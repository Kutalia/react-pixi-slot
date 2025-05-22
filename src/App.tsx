import { Application } from '@pixi/react'
import { MainContainer } from './Experience/MainContainer/MainContainer'
import { APP_HEIGHT, APP_WIDTH } from './constants'

function App() {
  return (
    <Application width={APP_WIDTH} height={APP_HEIGHT}>
      <MainContainer />
    </Application>
  )
}

export default App
