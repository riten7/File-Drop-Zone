import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import FileDropZone from './filedropzone/FileDropZone';

function App() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Upload Files
      </Button>
      <FileDropZone
        show={showModal}
        setShowModal={() => setShowModal(false)} />
    </div>
  );
}

export default App;
