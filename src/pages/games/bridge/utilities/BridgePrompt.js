export const BridgePrompts = {
  SERVER_DOWN: ["Unable to connect to server", "Try again"],
  ENTER_GAME_CODE: ["Enter game code"]
}

export function BridgePrompt(props){
  if(!props.prompt){return null}
  
  return (
    <div id="prompt-container">
      {
        props.prompt?.map((text)=>{
          return [text,<br></br>]
        })
      }
      {props.onKeyDown ? <input onKeyDown={props.onKeyDown} id="prompt-input"></input> : null}
    </div>
  )
}