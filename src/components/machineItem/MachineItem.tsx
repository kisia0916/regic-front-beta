import React from 'react'
import "./MachineItem.css"

function MachineItem(props:{machineName:string,machineId:string}) {
  return (
    <div className='machineItemMain'>
        <p>Name:{props.machineName}</p>
        <p>ID:{props.machineId}</p>
    </div>
  )
}

export default MachineItem