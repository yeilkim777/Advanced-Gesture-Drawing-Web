import React, { Component } from 'react';
import ReactDOM from 'react-dom';
let files = null;
let time = null;
let backForthArray = null;
let traverser = 0;
let pauseTime = false;
let gestureSession;
let timer, minutes, seconds;
let grayBoolean = true;

class FileInput extends Component {
  constructor() {
    super();
    this.processFile = this.processFile.bind(this);
    this.fileConfirm = this.fileConfirm.bind(this);
  }

  processFile() {
    files = document.getElementById("files").files;
    time = document.getElementById("timeForm").value / 1000;

    if (files.length === 0) {
      document.getElementsByClassName("file-name")[0].innerHTML = "No folder submitted"

    } else {
      backForthArray = [...Array(files.length).keys()]
      shuffleArray(backForthArray);
      ReactDOM.unmountComponentAtNode(document.getElementById('root'))
      ReactDOM.render(<SlideShow />, document.getElementById('root'));
    }

  }

  fileConfirm() {
    document.getElementsByClassName("file-name")[0].innerHTML = document.getElementById("files").files.length + " Files found";
  }

  render() {
    return (
      <div id='formDiv' class="columns is-mobile is-centered">
        <div class = "column m-6 box is-one-quarter is-info content">
          <h3 class = "is-size-3-tablet">Advanced Gesture Drawing Application</h3>
          <h4>Instructions:</h4>
          <ol>   
            <li>Select a folder of reference images.</li>
            <li>Choose the time interval.</li>
            <li>Start your drawing session.</li>
          </ol>
          <h4>    
            The provided editor can change:
          </h4>
          <ul>
            <li>Contrast</li>
            <li>Saturation</li>
            <li>Brightness</li>
            <li>Grayscale</li>
          </ul>

        </div>
        <div id="fileSubmit" class="column is-narrow m-6 box">
          <div class="file is-large has-name is-boxed is-info block">
            <label class="file-label">
              <input class="file-input" type="file" name="fileList" id="files" webkitdirectory='multiple' onChange={this.fileConfirm} />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                  Select an image folder
                </span>
              </span>
              <span class="file-name" >
              </span>
            </label>
          </div>
          <div class="select is-rounded is-medium container">
            <select id='timeForm' >
              <option value="15000"> 15 seconds </option>
              <option value="30000"> 30 seconds </option>
              <option value="60000"> 1 minute </option>
              <option value="120000"> 2 minutes </option>
              <option value="180000"> 3 minutes </option>
              <option value="300000"> 5 minutes </option>
              <option value="420000"> 7 minutes </option>
              <option value="600000"> 10 minutes </option>
              <option value="900000"> 15 minutes </option>
            </select>
          </div>
          {/* <div class = "has-text-centered"> */}
          <button type="button" class="button is-medium is-info is-rounded ml-3" onClick={this.processFile}>Start</button>
          {/* </div> */}
        </div>
        
      </div>
      );

  }
}

class SlideShow extends Component {
  constructor() {
    super();
    this.nextImg = this.nextImg.bind(this);
    this.prevImg = this.prevImg.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.pauseSession = this.pauseSession.bind(this);
    this.imageTimer = this.imageTimer.bind(this);
    this.setup = this.setup.bind(this);
    this.trueNextImg = this.trueNextImg.bind(this);
    this.newBegin = this.newBegin.bind(this);
    this.grayScale = this.grayScale.bind(this);
    this.superPower = this.superPower.bind(this);
    this.greatReset = this.greatReset.bind(this);
  }

  openFile(file) {
    var input = file;

    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
      var output = document.getElementById('gestureImg');
      output.src = dataURL;
    };
    reader.readAsDataURL(input);
  };

  nextImg() {
    if (traverser === backForthArray.length - 1) {
      document.getElementById("last").className = "modal is-active"
      clearInterval(gestureSession);
    } else {
      clearInterval(gestureSession);
      traverser += 1;
      this.openFile(files[backForthArray[traverser]])
      this.setup()
    }

  }

  trueNextImg() {

    if (traverser === backForthArray.length - 1) {
      document.getElementById("last").className = "modal is-active"
      clearInterval(gestureSession);
    } else {
      traverser += 1;
      this.openFile(files[backForthArray[traverser]])
    }
  }

  prevImg() {

    if (traverser === 0) {
      document.getElementById("zeroth").className = "modal is-active"
      clearInterval(gestureSession);
    } else {
      clearInterval(gestureSession);
      traverser -= 1;
      this.openFile(files[backForthArray[traverser]])
      this.setup()
    }
  }

  pauseSession() {
    if (!pauseTime) {
      pauseTime = true;
      document.getElementById("pause").innerHTML = `<span class="icon">
        <i class="fas fa-play"></i>
      </span> </button>`
    } else {
      pauseTime = false;
      document.getElementById("pause").innerHTML = `<span class="icon">
        <i class="fas fa-pause"></i>
      </span> </button>`
    }
  }
  stopSession() {
    files = null;
    time = null;
    backForthArray = null;
    traverser = 0;
    //gestureSec = 0;
    pauseTime = false;
    grayBoolean = true;
    this.greatReset()
    timer = 0;
    minutes = 0;
    seconds = 0;
    clearInterval(gestureSession);
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
    ReactDOM.render(<FileInput />, document.getElementById('root'));
  }

  grayScale () {
    if (grayBoolean) {
      document.getElementById('gestureWindow').style.backgroundColor = 'black'
      grayBoolean = false;
    } else {
      document.getElementById('gestureWindow').style.backgroundColor = 'white'
      grayBoolean = true;
    }
  }

  imageTimer() {
    if (!pauseTime) {
      if (timer <= 0) {
        timer = time;
        this.trueNextImg();
      }

      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      document.getElementById("displayTimer").innerHTML = minutes + ":" + seconds;
      timer--;
    }
  }

  setup() {
    timer = time;
    setTimeout(this.imageTimer, 10)
    gestureSession = setInterval(this.imageTimer, 1000)
  }

  newBegin() {
    this.setup();
    document.getElementById('zeroth').className = 'modal';
  }

  superPower() { 
    let superVerb
    if (document.getElementById('inputGray').checked == true) {
      superVerb = 'contrast('+ document.getElementById('inputContrast').value +') saturate(' + document.getElementById('inputSature').value + ') brightness(' + document.getElementById('inputBright').value + ') grayscale(1)'

    } else if (document.getElementById('inputGray').checked == false) {
      superVerb = 'contrast('+ document.getElementById('inputContrast').value +') saturate(' + document.getElementById('inputSature').value + ') brightness(' + document.getElementById('inputBright').value + ')'
    }
    document.getElementById('gestureImg').style.filter = superVerb
  }

  greatReset () {
    document.getElementById('gestureImg').style.filter = ''
    document.getElementById('inputContrast').value = 1;
    document.getElementById('inputSature').value = 1;
    document.getElementById('inputBright').value = 1;
    document.getElementById('inputGray').checked = false;

  }

  render() {
    return (
      <div id="gestureWindow" style={{ top: 0, bottom: '100%', height: '100vh', background: 'white' }}>
        <div style={{ position: 'fixed', top: 0, left: 0 }}>
          <span id="displayTimer" class="tag is-large is-dark" style={{ display: 'inline-block', margin: '10px' }}></span>

        </div>
        <div style={{ padding: 0, margin: 'auto auto', justifyContent: 'center', top: 0, bottom: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <img scr={this.openFile(files[backForthArray[traverser]])} alt="unsupported" id="gestureImg" style={{ padding: 0, display: 'block', maxHeight: '95vh', maxWidth: '100%', filter: ''}}></img>

          {this.setup()}

        </div>

        <div style={{ position: 'fixed', top: 0, right: 0 }} >
          <section className="section" style={{ paddingTop: '20px', paddingRight: '20px' }}>
            <div className="container">
              <div className="columns is-multiline">
                <Collapse title="Image Editor">
                  {/* <input id = 'inputSlide'  class = "slider" max="100" step="1" defaultValue = '0' type="range" width = '300px'onChange = {() => {console.log(document.getElementById('inputSlide').value)}}></input>
            <input id = ''  min="0" max="100" step="1" defaultValue = '0' type="range" width = '300px'onChange = {() => {console.log(document.getElementById('inputSlide').value)}}></input> */}
                  <div>
                  <div class="field">
                      <label class="label">Grayscale</label>
                      <div class="control">
                        <input id = 'inputGray' type="checkbox" onClick = {this.superPower}></input>
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Contrast</label>
                      <div class="control">
                        <input id = 'inputContrast'  class = "slider" min = '1' max="10" step="0.5" defaultValue = '1' type="range" width = '300px'onChange = {this.superPower}></input>
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Saturation</label>
                      <div class="control">
                        <input id = 'inputSature'  class = "slider" min = '1' max="10" step="0.5" defaultValue = '1' type="range" width = '100% !important'onChange = {this.superPower}></input>
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Brightness</label>
                      <div class="control">
                        <input id = 'inputBright'  class = "slider" min = '1' max="5" step="0.1" defaultValue = '1' type="range" width = '100px'onChange = {this.superPower}></input>
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Reset</label>
                      <div class="control">
                        {/* <input id = 'inputGray' type="checkbox" onChange = {() => {document.getElementById('gestureImg').style.filter = ''}}></input> */}
                        <button class="button is-info" id = 'inputGray' type="checkbox" onClick = {this.greatReset} >Reset</button>

                      </div>
                    </div>
                  </div>


                </Collapse>
              </div>
            </div>
          </section>
        </div>


        <div style={{ position: 'fixed', bottom: 0, right: 0 }}>
          <div class="buttons are-medium has-addons" style={{ margin: '10px', display: 'inline-block' }}>
            <button class="button" onClick={this.prevImg}>
              <span class="icon">
                <i class="fas fa-backward"></i>
              </span>
            </button>
            <button class="button" onClick={this.pauseSession} id="pause">
              <span class="icon">
                <i class="fas fa-pause"></i>
              </span> </button>
            <button class="button" onClick={this.nextImg}>
              <span class="icon">
                <i class="fas fa-forward"></i>
              </span>
            </button>
            <button class="button" onClick={this.stopSession}>
              <span class="icon">
                <i class="fa fa-stop"></i>
              </span>
            </button>
            <button class="button" onClick={this.grayScale}>
              <span class="icon">
                <i class="far fa-lightbulb"></i>
              </span>
            </button>

          </div>
        </div>
        <div id="zeroth" class="modal is-large">
          <div class="modal-background" onClick={this.newBegin} ></div>
          <div class="modal-content">
            <div class="notification is-warning">
              There is no previous image.
            </div>
          </div>
        </div>

        <div id="last" class="modal is-large">
          <div class="modal-background" onClick={() => { document.getElementById('last').className = 'modal'; }} ></div>
          <div class="modal-content">
            <div class="notification is-link">
              This is the final image.
              </div>
          </div>
        </div>

      </div>
    );
  }

}

class Collapse extends React.Component {
  constructor(props) {
    super(props)
    this.state = { cardState: false }
    this.toggleCardState = this.toggleCardState.bind(this)
  }

  toggleCardState() {
    this.setState({ cardState: !this.state.cardState })
  }

  render() {
    const { title, children } = this.props
    const { cardState } = this.state

    return (
      <div className="column is-6" style={{ width: '185px', margin: '0px', display: 'inline-block', padding: 0 }}>
        <div className="card" aria-hidden={cardState ? "false" : "true"}>
          <header
            className="card-header"
            style={{ cursor: "pointer" }}
            onClick={this.toggleCardState}>
            <p className="card-header-title">{title}</p>
            <a className="card-header-icon">
              <span
                className="icon"
                style={{
                  transform: cardState ? null : "rotate(180deg)",
                  transition: "transform 250ms ease-out",
                }}>
                <i className="fa fa-angle-up"></i>
              </span>
            </a>
          </header>
          <div
            className="card-content"
            style={{
              maxHeight: cardState ? 1000 : 0,
              padding: cardState ? null : 0,
              overflow: "hidden",
              transition: "max-height 250ms ease",
              transition: "padding 250ms ease",
            }}>
            <div className="content">{children} </div>
          </div>
        </div>
      </div>
    )
  }
}

Collapse.propTypes = {
  //title: React.PropTypes.string.isRequired,
}


function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

ReactDOM.render(
  <FileInput />
  , document.getElementById('root')
);
