!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_DirectEntryForm=__webpack_require__(1),_DirectEntryForm2=_interopRequireDefault(_DirectEntryForm),DirectEntry=function(_React$Component){function DirectEntry(props){_classCallCheck(this,DirectEntry);var _this=_possibleConstructorReturn(this,(DirectEntry.__proto__||Object.getPrototypeOf(DirectEntry)).call(this,props)),height=window.innerHeight/3,style={"margin-top":height},page=-1;return"ElementGroup"===props.InstrumentJSON.Elements[0].Type&&"Page"===props.InstrumentJSON.Elements[0].GroupType&&(page=0),_this.nextPage=_this.nextPage.bind(_this),_this.prevPage=_this.prevPage.bind(_this),_this.updateAnswer=_this.updateAnswer.bind(_this),_this.setupPageValues=_this.setupPageValues.bind(_this),_this.submit=_this.submit.bind(_this),_this.state={style:style,page:page,values:_this.props.Values,errors:{},InstrumentJSON:props.InstrumentJSON},_this}return _inherits(DirectEntry,_React$Component),_createClass(DirectEntry,[{key:"componentDidMount",value:function(){this.setupPageValues(this.state.page)}},{key:"setupPageValues",value:function(page){for(var pageElements=this.state.InstrumentJSON.Elements[page].Elements,pageValues={},i=0;i<pageElements.length;i++){var name=this.getElementName(pageElements[i]);if(name instanceof Array)for(var j=0;j<name.length;j++)name[j]in this.props.Values&&(pageValues[name[j]]=this.props.Values[name[j]]);else name in this.props.Values&&(pageValues[name]=this.props.Values[name])}this.setState({pageValues:pageValues})}},{key:"getElementName",value:function(element){var name=void 0;if("ElementGroup"===element.Type){name=[];for(var i=0;i<element.Elements.length;i++)name.push(this.getElementName(element.Elements[i]))}else name=element.Name;return name}},{key:"nextPage",value:function(){var _this2=this,page=0,finalPage=!1;this.state.page>0&&(page=this.state.page+1);var data={data:this.state.pageValues,page:page},that=this;this.state.page===this.state.InstrumentJSON.Elements.length-1&&(data.FinalPage=!0,finalPage=!0),$.ajax({url:window.location.href,data:JSON.stringify(data),type:"PUT",contentType:"application/json",success:function(result){var page=that.state.page+1,InstrumentJSON=void 0,reviewPage=void 0;finalPage?(InstrumentJSON=that.state.InstrumentJSON,reviewPage=JSON.parse(result)):InstrumentJSON=JSON.parse(result),that.setState({page:page,errors:{},InstrumentJSON:InstrumentJSON,ReviewData:reviewPage}),that.setupPageValues(page),window.scrollTo(0,0)}}).fail(function(responseData){if(400===responseData.status){var response=JSON.parse(responseData.responseText);_this2.setState({errors:response}),alert("Please resolve page errors before continuing")}})}},{key:"prevPage",value:function(){var page=this.state.page-1;this.setState({page:page,errors:{}}),this.setupPageValues(page),window.scrollTo(0,0)}},{key:"updateAnswer",value:function(fieldName,value){var data={};data[fieldName]=value,console.log(data),$.ajax({url:window.location.href,data:JSON.stringify(data),type:"PATCH",contentType:"application/json"}),this.setState(function(state){var values=state.values,pageValues=state.pageValues;return values[fieldName]=value,pageValues[fieldName]=value,{values:values,pageValues:pageValues}})}},{key:"submit",value:function(){$.ajax({url:window.location.href,type:"POST",contentType:"application/json"})}},{key:"render",value:function(){var DirectEntryFormElements=void 0,buttons=void 0;return DirectEntryFormElements=this.state.page===this.state.InstrumentJSON.Elements.length?React.createElement(ReviewPage,{reviewData:this.state.ReviewData}):this.state.page>=0?React.createElement(_DirectEntryForm2.default,{elements:this.state.InstrumentJSON.Elements[this.state.page].Elements,values:this.state.values,updateAnswer:this.updateAnswer,errors:this.state.errors}):React.createElement(_DirectEntryForm2.default,{elements:this.state.InstrumentJSON.Elements,values:this.state.values,updateAnswer:this.updateAnswer,errors:this.state.errors}),buttons=this.state.page===this.state.InstrumentJSON.Elements.length?React.createElement("div",null,React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.prevPage},"Prev"),React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.submit},"Submit")):this.state.page===-1||0===this.state.page&&1===this.state.InstrumentJSON.Elements.length?React.createElement("button",{type:"button",className:"btn btn-primary btn-lg"},"Done"):0===this.state.page?React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.nextPage},"Next"):this.state.page===this.state.InstrumentJSON.Elements.length-1?React.createElement("div",null,React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.prevPage},"Prev"),React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.nextPage},"Done")):React.createElement("div",null,React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.prevPage},"Prev"),React.createElement("button",{type:"button",className:"btn btn-primary btn-lg",onClick:this.nextPage},"Next")),React.createElement("div",null,React.createElement("nav",{className:"navbar navbar-default navbar-fixed-top"},React.createElement("span",_defineProperty({className:"h1"},"className","navbar-brand"),"LORIS")),React.createElement("div",{id:"page",className:"container-fluid",style:this.state.style},DirectEntryFormElements,React.createElement("div",{className:"question-container col-xs-12 col-sm-10 col-sm-offset-1"},buttons)))}}]),DirectEntry}(React.Component),ReviewPage=function(_React$Component2){function ReviewPage(props){return _classCallCheck(this,ReviewPage),_possibleConstructorReturn(this,(ReviewPage.__proto__||Object.getPrototypeOf(ReviewPage)).call(this,props))}return _inherits(ReviewPage,_React$Component2),_createClass(ReviewPage,[{key:"render",value:function(){var questions=this.props.reviewData.questions.map(function(element){return console.log(element),React.createElement("tr",{className:"reviewPage"},React.createElement("td",null,element.question),React.createElement("td",null,element.response))});return React.createElement("div",{className:"question-container col-xs-12 col-sm-10 col-sm-offset-1"},React.createElement("h3",null,"Review You Submission"),React.createElement("table",{className:"table table-striped table-bordered"},React.createElement("tbody",null,questions)))}}]),ReviewPage}(React.Component);window.DirectEntry=DirectEntry,exports.default=DirectEntry},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_GroupElement=__webpack_require__(2),_GroupElement2=_interopRequireDefault(_GroupElement),NotImplement=function(_React$Component){function NotImplement(props){return _classCallCheck(this,NotImplement),_possibleConstructorReturn(this,(NotImplement.__proto__||Object.getPrototypeOf(NotImplement)).call(this,props))}return _inherits(NotImplement,_React$Component),_createClass(NotImplement,[{key:"render",value:function(){return React.createElement("div",null,this.props.element.Type," is not yet implemented")}}]),NotImplement}(React.Component),DirectEntryFormElement=function(_React$Component2){function DirectEntryFormElement(props){return _classCallCheck(this,DirectEntryFormElement),_possibleConstructorReturn(this,(DirectEntryFormElement.__proto__||Object.getPrototypeOf(DirectEntryFormElement)).call(this,props))}return _inherits(DirectEntryFormElement,_React$Component2),_createClass(DirectEntryFormElement,[{key:"render",value:function(){var element=void 0;switch(this.props.element.Type){case"select":element=React.createElement(SelectElement,{element:this.props.element,value:this.props.values[this.props.element.Name],updateAnswer:this.props.updateAnswer,error:this.props.errors[this.props.element.Name]});break;case"text":element=React.createElement(TextElement,{element:this.props.element,value:this.props.values[this.props.element.Name],updateAnswer:this.props.updateAnswer,error:this.props.errors[this.props.element.Name]});break;case"date":element=React.createElement(DateElement,{element:this.props.element,value:this.props.values[this.props.element.Name],updateAnswer:this.props.updateAnswer,error:this.props.errors[this.props.element.Name]});break;case"label":element=React.createElement(LabelElement,{element:this.props.element});break;case"header":element=React.createElement(HeaderElement,{element:this.props.element});break;case"ElementGroup":element=React.createElement(_GroupElement2.default,{element:this.props.element,values:this.props.values,updateAnswer:this.props.updateAnswer,errors:this.props.errors});break;default:element=React.createElement(NotImplement,{element:this.props.element})}return React.createElement("div",{className:"question-container col-xs-12 col-sm-10 col-sm-offset-1"},element)}}]),DirectEntryFormElement}(React.Component),Page=function(_React$Component3){function Page(props){return _classCallCheck(this,Page),_possibleConstructorReturn(this,(Page.__proto__||Object.getPrototypeOf(Page)).call(this,props))}return _inherits(Page,_React$Component3),_createClass(Page,[{key:"render",value:function(){var _this4=this,DirectEntryFormElements=this.props.elements.map(function(element){return React.createElement(DirectEntryFormElement,{element:element,values:_this4.props.values,updateAnswer:_this4.props.updateAnswer,errors:_this4.props.errors})});return React.createElement("div",null,DirectEntryFormElements)}}]),Page}(React.Component),SelectElement=function(_React$Component4){function SelectElement(props){_classCallCheck(this,SelectElement);var _this5=_possibleConstructorReturn(this,(SelectElement.__proto__||Object.getPrototypeOf(SelectElement)).call(this,props));return _this5.state={value:""},_this5}return _inherits(SelectElement,_React$Component4),_createClass(SelectElement,[{key:"onSelect",value:function(value){this.props.updateAnswer(this.props.element.Name,value)}},{key:"render",value:function(){var options=[];for(var key in this.props.element.Options.Values){var checked=void 0;""!==key&&(key===this.props.value&&(checked=React.createElement("i",{className:"glyphicon glyphicon-ok"})),options.push(React.createElement("div",{className:"col-xs-12 col-sm-6 select-option",onClick:this.onSelect.bind(this,key)},React.createElement("label",{className:"btn btn-defualt btn-circle active"},checked),this.props.element.Options.Values[key])))}var element=React.createElement("div",{className:"row field_input","data-toggle":"buttons"},options),classInfo="col-xs-12 field_question";return this.props.error&&(classInfo+=" has-error"),React.createElement("div",null,React.createElement("h3",{className:classInfo},React.createElement(Markdown,{content:this.props.element.Description})),element)}}]),SelectElement}(React.Component),TextElement=function(_React$Component5){function TextElement(props){_classCallCheck(this,TextElement);var _this6=_possibleConstructorReturn(this,(TextElement.__proto__||Object.getPrototypeOf(TextElement)).call(this,props));return _this6.updateText=_this6.updateText.bind(_this6),_this6}return _inherits(TextElement,_React$Component5),_createClass(TextElement,[{key:"updateText",value:function(e){this.props.updateAnswer(this.props.element.Name,e.target.value)}},{key:"render",value:function(){var type=void 0;type="small"===this.props.element.Options.Type?React.createElement("input",{name:this.props.element.Name,type:"text",className:"form-control",onChange:this.updateText,value:value}):React.createElement("textarea",{name:this.props.element.Name,className:"form-control",onChange:this.updateText,value:value});var classInfo="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4",value="";return this.props.error&&(classInfo+=" has-error"),this.props.value&&(value=this.props.value),React.createElement("div",null,React.createElement("h3",{className:"col-xs-12 field_question"},React.createElement(Markdown,{content:this.props.element.Description})),React.createElement("div",{className:classInfo},type))}}]),TextElement}(React.Component),DateElement=function(_React$Component6){function DateElement(props){_classCallCheck(this,DateElement);var _this7=_possibleConstructorReturn(this,(DateElement.__proto__||Object.getPrototypeOf(DateElement)).call(this,props));return _this7.updateDate=_this7.updateDate.bind(_this7),_this7}return _inherits(DateElement,_React$Component6),_createClass(DateElement,[{key:"updateDate",value:function(e){this.props.updateAnswer(this.props.element.Name,e.target.value)}},{key:"render",value:function(){var classInfo="col-xs-12 field_question";return this.props.error&&(classInfo+=" has-error"),React.createElement("div",null,React.createElement("h3",{className:classInfo},React.createElement(Markdown,{content:this.props.element.Description})),React.createElement("div",{className:"col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"},React.createElement("input",{name:this.props.element.Name,type:"date",className:"form-control",min:this.props.element.Options.MinDate,max:this.props.element.Options.MaxDate,onChange:this.updateDate,value:this.props.value})))}}]),DateElement}(React.Component),LabelElement=function(_React$Component7){function LabelElement(props){return _classCallCheck(this,LabelElement),_possibleConstructorReturn(this,(LabelElement.__proto__||Object.getPrototypeOf(LabelElement)).call(this,props))}return _inherits(LabelElement,_React$Component7),_createClass(LabelElement,[{key:"render",value:function(){return React.createElement("div",null,React.createElement(Markdown,{content:this.props.element.Description}))}}]),LabelElement}(React.Component),HeaderElement=function(_React$Component8){function HeaderElement(props){return _classCallCheck(this,HeaderElement),_possibleConstructorReturn(this,(HeaderElement.__proto__||Object.getPrototypeOf(HeaderElement)).call(this,props))}return _inherits(HeaderElement,_React$Component8),_createClass(HeaderElement,[{key:"render",value:function(){var element=void 0;switch(this.props.element.Options.Level){default:element=React.createElement("h1",null,this.props.element.Description)}return React.createElement("div",null,element)}}]),HeaderElement}(React.Component);exports.default=Page},function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),GroupElement=function(_React$Component){function GroupElement(props){return _classCallCheck(this,GroupElement),_possibleConstructorReturn(this,(GroupElement.__proto__||Object.getPrototypeOf(GroupElement)).call(this,props))}return _inherits(GroupElement,_React$Component),_createClass(GroupElement,[{key:"render",value:function(){var element=void 0;switch(this.props.element.GroupType){case"Element":element=React.createElement(ElementGroup,{element:this.props.element,values:this.props.values,updateAnswer:this.props.updateAnswer,errors:this.props.errors})}return React.createElement("div",null,element)}}]),GroupElement}(React.Component),ElementGroup=function(_React$Component2){function ElementGroup(props){return _classCallCheck(this,ElementGroup),_possibleConstructorReturn(this,(ElementGroup.__proto__||Object.getPrototypeOf(ElementGroup)).call(this,props))}return _inherits(ElementGroup,_React$Component2),_createClass(ElementGroup,[{key:"render",value:function(){var labelClass=void 0,elementClass=void 0,elements=void 0,error=void 0;switch(this.props.element.Elements.length){case 1:labelClass="col-xs-12 col-sm-4",elementClass="col-xs-12 col-sm-8";break;case 2:labelClass="col-xs-12 col-sm-4",elementClass="col-xs-12 col-sm-4";break;case 3:labelClass="col-xs-12 col-sm-3",elementClass="col-xs-12 col-sm-3";break;case 4:labelClass="col-xs-12 col-sm-4",elementClass="col-xs-12 col-sm-2";break;case 5:labelClass="col-xs-12 col-sm-2",elementClass="col-xs-12 col-sm-2"}return this.props.errors[this.props.element.Name]&&(error=!0),elements=this.props.element.Elements.map(function(element){return!error&&this.props.errors[element.Name]&&(error=!0),React.createElement(BaseElement,{element:element,classInfo:elementClass,value:this.props.values[element.Name],updateAnswer:this.props.updateAnswer,error:error})}.bind(this)),React.createElement("div",{className:"col-xs-12"},React.createElement("div",{className:labelClass},React.createElement(Markdown,{content:this.props.element.Description})),elements)}}]),ElementGroup}(React.Component),BaseElement=function(_React$Component3){function BaseElement(props){_classCallCheck(this,BaseElement);var _this3=_possibleConstructorReturn(this,(BaseElement.__proto__||Object.getPrototypeOf(BaseElement)).call(this,props));return console.log(props),_this3.updateValue=_this3.updateValue.bind(_this3),_this3}return _inherits(BaseElement,_React$Component3),_createClass(BaseElement,[{key:"updateValue",value:function(e){console.log(e.target.value),this.props.updateAnswer(this.props.element.Name,e.target.value)}},{key:"render",value:function(){var element=void 0,classInfo=this.props.classInfo;switch(this.props.error&&(classInfo+=" has-error"),this.props.element.Type){case"text":element=React.createElement("input",{type:"text",name:this.props.element.Name,className:"form-control",onChange:this.updateValue,value:this.props.value});break;case"select":var options=[],value=null!=this.props.value?this.props.value:"";for(var key in this.props.element.Options.Values)options.push(React.createElement("option",{value:key},this.props.element.Options.Values[key]));element=React.createElement("select",{className:"form-control",onChange:this.updateValue,value:value},options);break;case"label":element=React.createElement(Markdown,{content:this.props.element.Description});break;default:element=React.createElement("div",null,this.props.element.Type," is not yet implemented group")}return React.createElement("div",{className:classInfo},element)}}]),BaseElement}(React.Component);exports.default=GroupElement}]);
//# sourceMappingURL=DirectEntry.js.map