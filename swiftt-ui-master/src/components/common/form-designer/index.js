import React, { PureComponent } from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');

let fields = [
  // {
  //   type: 'autocomplete',
  //   label: 'Custom Autocomplete',
  //   required: true,
  //   values: [
  //     {label: 'SQL'},
  //     {label: 'C#'},
  //     {label: 'JavaScript'},
  //     {label: 'Java'},
  //     {label: 'Python'},
  //     {label: 'C++'},
  //     {label: 'PHP'},
  //     {label: 'Swift'},
  //     {label: 'Ruby'}
  //   ]
  // },
  // {
  //   label: 'Star Rating',
  //   attrs: {
  //     type: 'starRating'
  //   },
  //   icon: '🌟'
  // }
  // {
  //   label: "DateTime",
  //   type: "text",
  //   subtype: "datetime-local",
  //   icon: "DT"
  // },
  // {
  //   type: 'checkbox-group',
  //   label: 'Checkbox'
  // },
  {
    label: 'Line Break',
    type: 'break',
    icon: ' — '
  }
];

// let replaceFields = [
//   {
//     type: 'textarea',
//     subtype: 'tinymce',
//     label: 'tinyMCE',
//     required: true,
//   }
// ];

// let actionButtons = [{
//   id: 'smile',
//   className: 'btn btn-success',
//   label: '😁',
//   type: 'button',
//   events: {
//     click: function() {
//       alert('😁😁😁 !SMILE! 😁😁😁');
//     }
//   }
// }];

let templates = {
  // starRating: function(fieldData) {
  //   return {
  //     field: '<span id="'+fieldData.name+'">',
  //     onRender: function() {
  //       $(document.getElementById(fieldData.name)).rateYo({rating: 3.6});
  //     }
  //   };
  // },
  break: function(fieldData) {
      return {
        field: '<hr class='+fieldData.className+'>'
      };
    },
//   'checkbox-group': function(fieldData) {
//     console.log(this);
//     const { values: options } = fieldData;
//     return {
//       field: options.map((opt, i) => {
//         const { label, selected, ...attrs } = opt;
//         const name = `${fieldData.id}-${i}`;
//         attrs.checked = selected;
//         attrs.type = "checkbox";
//         attrs.id = name;
//         const attrsString = Object.keys(attrs)
//           .map(attr => `${attr}="${attrs[attr]}"`)
//           .join(" ");
//
// //  ant-checkbox-group-item ant-checkbox-wrapper
//         return `<label class="fb-checkbox-label">
//                   <span class="ant-checkbox ant-checkbox-checked">
//                     <input ${attrsString} class="ant-checkbox-input">
//                     <span class="ant-checkbox-inner"></span>
//                   </span>
//                   <span> ${label}</span>
//                 </label>`;
//
//         //return `<label for="${name}" class="fb-checkbox-label"><input ${attrsString} class="ant-checkbox-input"> ${label}</label>`;
//       })
//     };
//   }
};

// let inputSets = [{
//   label: 'User Details',
//   icon: '👨',
//   name: 'user-details', // optional
//   showHeader: true, // optional
//   fields: [{
//     type: 'text',
//     label: 'First Name',
//     className: 'form-control'
//   }, {
//     type: 'select',
//     label: 'Profession',
//     className: 'form-control',
//     values: [{
//       label: 'Street Sweeper',
//       value: 'option-2',
//       selected: false
//     }, {
//       label: 'Brain Surgeon',
//       value: 'option-3',
//       selected: false
//     }]
//   }, {
//     type: 'textarea',
//     label: 'Short Bio:',
//     className: 'form-control'
//   }]
// }, {
//   label: 'User Agreement',
//   fields: [{
//     type: 'header',
//     subtype: 'h3',
//     label: 'Terms & Conditions',
//     className: 'header'
//   }, {
//     type: 'paragraph',
//     label: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
//   }, {
//     type: 'paragraph',
//     label: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.',
//   }, {
//     type: 'checkbox',
//     label: 'Do you agree to the terms and conditions?',
//   }]
// }];

let typeUserDisabledAttrs = {
  autocomplete: ['access'],
  'checkbox-group': ['inline', 'toggle'],
};

let typeUserAttrs = {
  // 'checkbox-group': {
  //   className: {
  //     label: 'Class',
  //     options: {
  //       'ant-checkbox-group': 'Default'
  //     }
  //   }
  // },
  // checkbox: {
  //   className: {
  //     label: 'Class',
  //     options: {
  //       'ant-checkbox-input': 'Default'
  //     }
  //   }
  // },
  date: {
    className: {
      label: 'Class',
      options: {
        'ant-input': 'Default'
      }
    }
  },
  number: {
    className: {
      label: 'Class',
      options: {
        'ant-input': 'Default'
      }
    }
  },
  text: {
    className: {
      label: 'Class',
      options: {
        'ant-input': 'Default'
      }
    }
  },
  textarea: {
    className: {
      label: 'Class',
      options: {
        'ant-input': 'Default'
      }
    }
  }
};

// test disabledAttrs
//let disabledAttrs = ['placeholder'];

class FormDesigner extends PureComponent {

  componentDidMount() {
    let ed = $("#editor");

    let fbOptions = {
      dataType: 'json',
      subtypes: {
        text: ['datetime-local']
      },
      notify: {
        error: message => console.error(message),
        success: message => console.log(message),
        warning: message => console.warn(message),
      },
      onSave: (e, formData) => this.onSaveHandler(formData),
      stickyControls: {
        enable: true
      },
      showActionButtons: true,
      sortableControls: true,
      fields: fields,
      templates: templates,
      // layoutTemplates: {
      //   default: function(field, label, help, data) {
      //     help = $('<div/>')
      //       .addClass('helpme')
      //       .attr('id', 'row-' + data.id)
      //       .append(help);
      //     return $('<div/>').append(label, field, help);
      //   }
      // },
      //inputSets: inputSets,
      typeUserDisabledAttrs: typeUserDisabledAttrs,
      typeUserAttrs: typeUserAttrs,
      disableInjectedStyle: false,
      //actionButtons: actionButtons,
      disabledActionButtons: ['data'],
      disableFields: ['autocomplete', 'file', 'button', 'hidden'],
      editOnAdd: true,
      //replaceFields: replaceFields,
      // disabledFieldButtons: {
      //   text: ['copy']
      // },
      controlOrder: [
        'header',
        'paragraph',
        'text',
        'textarea'
      ],
      disabledAttrs: ['access', 'className', 'value', 'description'],
      i18n: {
        //locale: 'ru-RU'
        //location: 'http://languagefile.url/directory/'
        //extension: '.ext'
        //preloaded: {
        //    'en-US': {...}
        //}
      }
    };

    ed.formBuilder(fbOptions);
  }

  onSaveHandler = (formData) => {
    const { onEditorChange } = this.props;
    onEditorChange(JSON.stringify(JSON.parse(formData)));
  }

  render() {
    return(
      <div>
        <div id="editor" />
        <style>
          {`
            .form-wrap.form-builder .frmb .form-elements {
              padding: 10px 10px 30px 10px;
              border-radius: 0px;
              background: #FFFFFF;
            }

            .form-wrap.form-builder .frmb .form-elements .false-label:first-child,
            .form-wrap.form-builder .frmb .form-elements label:first-child {
              padding-top: 0px;
              font-weight: 400;
            }

            .form-wrap.form-builder .frmb .field-label,
            .form-wrap.form-builder .frmb .legend,
            .form-wrap.form-builder .form-control {
              font-size: 11px;
              line-height: 1.5;
            }

            .form-wrap.form-builder .stage-wrap {
              width: 80%;
            }

            .form-wrap.form-builder .cb-wrap {
              width: 20%;
            }

            .form-wrap.form-builder .frmb-control li {
              line-height: 39.99999px;
              padding: 0 15px;
              color: #fff;
              background-color: #9347a3;
              border-color: #9347a3;
              font-weight: 400;
              cursor: pointer;
              background-image: none;
              border: 1px solid transparent;
              white-space: nowrap;
              font-size: 11px;
              border-radius: 4px;
            }

            .form-wrap.form-builder .frmb li.paragraph-field p {
              line-height: 1.5;
            }
          `}
        </style>
      </div>
    );
  }

}

export default FormDesigner;
