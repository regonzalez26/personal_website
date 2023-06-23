export const BridgePromptType = Object.freeze({
  BUTTON: "button",
  INPUT: "input",
  TEXT_ONLY: "text_only",
  BUTTON_ONLY: "button_only"
})

export const BridgePrompts = Object.freeze({
  SERVER_DOWN: {
    text: ["Unable to connect to server", "Try again"],
    type: BridgePromptType.TEXT_ONLY
  },
  ENTER_GAME_CODE: {
    text: ["Enter game code"],
    type: BridgePromptType.INPUT
  },
  GAME_NOT_FOUND: {
    text: ["Game not found"],
    type: BridgePromptType.TEXT_ONLY
  },
  START_GAME: {
    text: ["Start"],
    type: BridgePromptType.BUTTON_ONLY
  }
})

export function BridgePrompt(props){
  if(!props.prompt){return null}

  const generateButton = (handleClick, label) => {
    return (
      <button type="button" onClick={handleClick} id="prompt-button">
        {label}
      </button>
    )
  }

  const generateInput = (onKeyDown) => {
    return (
      <input onKeyDown={onKeyDown} type="text" id="prompt-input" />
    )
  }

  let promptInput, promptText
  switch(props.prompt.type){
    case BridgePromptType.BUTTON:
      promptText = props.prompt.text
      promptInput = generateButton(props.onClick, props.label)
      break
    case BridgePromptType.BUTTON_ONLY:
      promptInput = generateButton(props.onClick, props.prompt.text[0])
      break
    case BridgePromptType.INPUT:
      promptText = props.prompt.text
      promptInput = generateInput(props.onKeyDown)
      break
    case BridgePromptType.TEXT_ONLY:
    default:
      promptText = props.prompt.text
    break
  }
  
  return (
    <div id="prompt-container">
      {
        promptText?.map((text)=>{
          return [text,<br></br>]
        })
      }
      {promptInput}
    </div>
  )
}