export function BridgeToolbar(props){
  const generateToolbarButton = (toolbar) => {
    return <button onClick={() => {toolbar.fxn()}}>{toolbar.label}</button>
  }

  let leftToolbars = []
  let rightToolBars = []

  props.toolbars?.map((toolbar, index) => {
    let mid = (props.toolbars.length - 1) / 2
    if(index < mid){
      leftToolbars.push(toolbar)
    } else {
      rightToolBars.push(toolbar)
    }
  })

  return (
    <div id="bridge-game-header">
      {
        props.toolbars?.map((toolbar, index) => {
          let toolbarButton = <button key={Math.random()} onClick={()=>{toolbar.fxn()}}>{toolbar.label}</button>
          let titleBar = index >= props.toolbars.length/2 || props.toolbars.length === 1 ? <div key={Math.random()} id="bridge-game-title">Bridge</div> : null
          return [titleBar, toolbarButton]
        })
      }
    </div>
  )
}