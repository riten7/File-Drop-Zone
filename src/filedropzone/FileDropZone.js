import React, { useRef, useState } from 'react';
import { Modal } from 'antd';

import './filedropzone.css';

const FileDropzone = (props) => {
  const { setShowModal, show } = props;
  const fileInputRef = useRef();
  const [validFiles, setValidFiles] = useState([]);

  const preventDefault = (e) => {
    e.preventDefault();
  }

  const dragOver = (e) => {
    preventDefault(e);
  }

  const dragEnter = (e) => {
    preventDefault(e);
  }

  const dragLeave = (e) => {
    preventDefault(e);
  }

  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const handleFiles = (files) => {
    let fileNames = [];
    let updatedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = {
        file: files[i],
        name: files[i].name,
        size: files[i].size,
        type: files[i].type,
        originalName: files[i].name,
      }
      updatedFiles.push(file);
    }

    const validFiles = validateFiles(updatedFiles, fileNames);
    setValidFiles(prevArray => {
      return prevArray.concat(validFiles);
    });
  }

  const removeFile = (name) => {
    const index = validFiles.findIndex(e => e.name === name);
    validFiles.splice(index, 1);
    setValidFiles([...validFiles]);
  }

  const handleAddFiles = () => {
    console.log('valid files', validFiles);
    setShowModal();
    setValidFiles([]);
  }

  const handleCancel = () => {
    setValidFiles([]);
    setShowModal();
  }

  const isInvalidFiles = () => {
    return validFiles.length === 0 || validFiles.some(file => file.invalid !== false);
  }

  const onRenameFileName = (e, fileIndex) => {
    var name = e.target.value;
    var fileNames = [];
    let files = validFiles.map((item, index) => {
      if (index === fileIndex) {
        fileNames.push(name);
        return { ...item, name: name }
      }
      fileNames.push(item.name);
      return item;
    });

    const duplicateFileNames = findDuplicateNames(fileNames);
    const validUpdatedFiles = validateFiles(files, duplicateFileNames);

    setValidFiles(validUpdatedFiles);
  }

  const validateFiles = (files, duplicateFiles) => {
    return files.map(file => {
      if (file.name === '') {
        return { ...file, invalid: true, error: 'File name cannot be empty' }
      }
      if (duplicateFiles.includes(file.name)) {
        return { ...file, invalid: true, error: 'Duplicate File' }
      }
      if (!validTypes.includes(file.type)) {
        return { ...file, invalid: true, error: 'unsupported file' }
      }
      return { ...file, invalid: false, error: '' }
    })
  }


  return (
    <Modal
      visible={show}
      title='Add Files'
      okText='Done'
      onOk={handleAddFiles}
      okButtonProps={{ disabled: isInvalidFiles() }}
      onCancel={handleCancel}
    >
      <div className="container">
        <div className="drop-container"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
          <div className="drop-message">
            <div className="upload-icon"></div>
            Drag and drop or BROWSE files <br />
            Supported files 'jpeg', 'jpg', 'png', 'gif', 'x-icon'
                    </div>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            multiple
            onChange={filesSelected}
          />
        </div>
        <div className="file-display-container">
          {
            validFiles.map((data, i) =>

              <div className="file-status-bar" key={i}>
                <div>
                  <div className="file-type-logo"></div>
                  <input className={`file-name ${data.invalid ? 'file-error' : ''}`} defaultValue={getFileNameWithoutExtension(data.name)} onChange={(e) => onRenameFileName(e, i)} />
                  <div className="file-type">.{fileType(data.originalName)}</div>
                  {data.invalid && <div className='file-error-message'>({data.error})</div>}
                </div>
                <div className="file-remove" onClick={() => removeFile(data.name)}>Remove</div>
              </div>
            )
          }
        </div>
      </div>
    </Modal>
  );
}

export default FileDropzone;

export const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];

export const fileType = (fileName) =>  fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;

export const getFileNameWithoutExtension = (fileName) => fileName.replace('.'+fileType(fileName), ''); 

export const findDuplicateNames = (filenames) => {
  return filenames.filter((file, index) => filenames.indexOf(file) !== index);
}

export const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};
