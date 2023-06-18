export function BridgeToolbar(props){
  return (
    <div id="bridge-game-header">
      {
        props.toolbars?.map((toolbar, index) => {
          let toolbarButton = <button key={Math.random()} onClick={()=>{toolbar.fxn()}}>{toolbar.label}</button>
          let titleBar = index >= props.toolbars.length/2 ? <div key={Math.random()} id="bridge-game-title">Bridge</div> : null
          return [titleBar, toolbarButton]
        })
      }
    </div>
  )
}