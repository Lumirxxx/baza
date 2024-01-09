import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from '@tinymce/tinymce-react';


const Editor3 = () => {
  const [content, setContent] = useState('');

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const uploadImageCallback = (blobInfo, success, failure) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    formData.append('token', localStorage.getItem('token'));
fetch('http://192.168.10.109:8000/api/v1/images/', {
  method: 'POST',
  body: formData,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
})
    .then(response => response.json())
    .then(data => {
      if (data.img) {
        success(data.img);
      } else {
        failure('Could not upload image: ' + JSON.stringify(data));
      }
    })
    .catch(error => {
      failure('HTTP Error: ' + error.message);
    });
  };

  return (
    <Editor
      initialValue="<p>This is the initial content of the editor</p>"
      apiKey="efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v"
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: uploadImageCallback,
        file_picker_callback: function (cb, value, meta) {
          // Code for file picker callback
        }
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default Editor3;
