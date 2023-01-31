import './App.css';
import logo from './images/bitmovin-logo.png';
import playlist from './playlist.json';
import BitmovinPlayer from './bitmovinPlayer';

function App() {
  const userId = '9d55ee79724c41dd848d6f7ec63c0d11';

  return (
    <div className='app'>
      <div id='wrapper'>
        <div id='banner'>
          <div className='logo'><img src={logo}/></div>
        </div>
        <div className='container'>
          <div className='content'>
            <div id='player-wrapper'>
              <BitmovinPlayer userId={userId} playlist={playlist}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
