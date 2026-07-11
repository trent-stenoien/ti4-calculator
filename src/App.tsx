import { useState } from 'react'
import reactLogo from './assets/barony_of_letnev.png'
import './App.css'

function App() {
    const [count, setCount] = useState(0);
    const [hide, setHide] = useState(true);

    const toggleHide = () => setHide(!hide);



    /*

    div: faction selector, swap, faction selector
    div: up, p1, flagship, p2, up
        etc, carrier
        etc, cruiser
        etc, destroyer
        etc, dreadnaught
        etc, fighter
        etc, war sun
    div: clear attacker, space/land selector, clear attacker

    
    */

  return (
    <>
        <h1>Twilight Imperium 4</h1>
        <h2>Battle Calculator</h2>

        <form>
            <label for="faction-select">Faction:</label>
            <select name="faction" id="faction-select">
              <option value="barony">Barony of Letnev</option>
              <option value="sol">Empire of Sol</option>
            </select>
        </form>
    </>
  )
}

export default App

/*
Build rest of dropdowns later.
              <option value="">--Please choose an option--</option>
*/