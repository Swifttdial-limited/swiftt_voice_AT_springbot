import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// let editorContent = undefined;
// let editorState = EditorState.createEmpty();
//
// function CustomEditor({
//   content,
//   onContentChange
// }) {
//
//   if(content.length > 1) {
//     editorState = null;
//     const contentBlock = htmlToDraft(content);
//     if (contentBlock) {
//       const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//       editorState = EditorState.createWithContent(contentState);
//     }
//     onEditorStateChange(editorState);
//   } else {
//     EditorState.createEmpty();
//     onEditorStateChange(editorState);
//   }
//
//   function onEditorChange(newEditorContent) {
//     const htmlContent = draftToHtml(newEditorContent)
//
//     console.log(htmlContent)
//
//     editorContent = newEditorContent;
//     //onContentChange(htmlContent, htmlContent);
//   };
//
//   function onEditorStateChange(newEditorState) {
//     editorState = newEditorState;
//   }
//
//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         toolbarClassName="home-toolbar"
//         wrapperClassName="home-wrapper"
//         editorClassName="home-editor"
//         onEditorStateChange={onEditorStateChange}
//         toolbar={{
//          options: ['history', 'inline', 'list', 'textAlign', 'blockType'],
//          history: {
//              inDropdown: true,
//          },
//          inline: {
//              inDropdown: false,
//              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
//          },
//          list: {
//              inDropdown: true,
//          },
//          textAlign: {
//              inDropdown: true,
//          },
//      }}
//         onContentStateChange={onEditorChange}
//         placeholder="Please enter the text"
//         spellCheck
//         localization={{
//            locale: 'en',
//            translations: {
//              'generic.add': 'Test-Add',
//            },
//        }}
//       />
//
//       <style>
//         {`
//            .home-editor {
//                min-height: 300px;
//            }
//            .rdw-link-modal{
//                min-height:250px
//            }
//            .rdw-dropdown-selectedtext{
//                color:#000
//            }
//        `}
//       </style>
//     </div>
//   );
// }
//
// export default CustomEditor;

class CustomEditor extends PureComponent {

  static defaultProps = {
    //rawContent: '',
    onContentChange: () => {},
  };

  static propTypes = {
    rawContent: PropTypes.string,
    onContentChange: PropTypes.func.isRequired,
  };

  state = {
    editorContent: undefined,
    contentState: {},
    editorState: '',
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.rawContent) {
      this.contentHandler(nextProps.rawContent);
    }
  }

  contentHandler = content => {
    let editorState = null;

    if(content) {
      const contentBlock = htmlToDraft(content);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState = EditorState.createWithContent(contentState);
      }
    } else {
      editorState = EditorState.createEmpty();
    }

    this.onEditorStateChange(editorState);
  }

  onEditorChange = (editorContent) => {
    const htmlContent = draftToHtml(editorContent)

    this.setState({ editorContent }, () => {
      // TODO debounce hapa
      this.props.onContentChange(htmlContent, htmlContent);
    });
  };

  onEditorStateChange = editorState => this.setState({ editorState });

  render() {
    const { editorContent, editorState } = this.state;

    return(
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="home-toolbar"
          wrapperClassName="home-wrapper"
          editorClassName="home-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
           options: ['history', 'inline', 'list', 'textAlign', 'blockType'],
           history: {
               inDropdown: true,
           },
           inline: {
               inDropdown: false,
               options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
           },
           list: {
               inDropdown: true,
           },
           textAlign: {
               inDropdown: true,
           },
       }}
          onContentStateChange={this.onEditorChange}
          placeholder="Please enter the text"
          spellCheck
          localization={{
             locale: 'en',
             translations: {
               'generic.add': 'Test-Add',
             },
         }}
        />

        <style>
          {`
             .home-editor {
                 min-height: 300px;
             }
             .rdw-link-modal{
                 min-height:250px
             }
             .rdw-dropdown-selectedtext{
                 color:#000
             }
         `}
        </style>
      </div>
    );
  }

}

export default CustomEditor;
