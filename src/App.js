import './App.css';
import logo from './images/bitmovin-logo.png';
import BitmovinPlayer from './bitmovinPlayer';

function App() {
  return (
    <div className='app'>
      <div id='wrapper'>
        <div id='banner'>
          <div className='logo'><img src={logo}/></div>
        </div>
        <div className='container'>
          <div className='content'>
            <div id='player-wrapper'>
              <BitmovinPlayer/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
