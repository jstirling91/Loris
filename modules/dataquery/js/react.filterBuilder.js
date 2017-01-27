!function(e){function t(s){if(a[s])return a[s].exports;var r=a[s]={exports:{},id:s,loaded:!1};return e[s].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});/**
	 *  The following file contains the components used for the filter builder tab
	 *
	 *  @author   Jordan Stirling <jstirling91@gmail.com>
	 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
	 *  @link     https://github.com/mohadesz/Loris-Trunk
	 */
var a=React.createClass({displayName:"LogicOperator",changeOperator:function(e){this.props.updateGroupOperator(e)},render:function(){var e="btn",t="btn";return 1===this.props.logicOperator?(t+=" btn-primary",e+=" switch"):(e+=" btn-primary",t+=" switch"),React.createElement("div",{className:"btn-group",role:"group"},React.createElement("button",{type:"button",className:e,onClick:this.changeOperator.bind(this,0)},"And"),React.createElement("button",{type:"button",className:t,onClick:this.changeOperator.bind(this,1)},"Or"))}}),s=React.createClass({displayName:"FilterRule",getInitialState:function(){return{operators:{equal:"=",notEqual:"!=",lessThanEqual:"<=",greaterThanEqual:">=",startsWith:"startsWith",contains:"contains"},value:""}},componentWillMount:function(){this.valueSet=loris.debounce(this.valueSet,1e3)},selectInstrument:function(e){var t=this.props.rule,a=this;e.target.value&&(t.instrument=e.target.value,$.get(loris.BaseURL+"/AjaxHelper.php?Module=dataquery&script=datadictionary.php",{category:t.instrument},function(e){t.fields=e,a.props.updateRule(a.props.index,t)},"json"))},fieldSelect:function(e){var t=JSON.parse(JSON.stringify(this.props.rule));delete t.field,delete t.fieldType,delete t.operator,delete t.value,delete t.visit,delete t.candidates,e.target.value&&(t.field=t.fields[e.target.value].key[1],t.fieldType=t.fields[e.target.value].value.Type),this.props.updateRule(this.props.index,t)},operatorSelect:function(e){var t=JSON.parse(JSON.stringify(this.props.rule));delete t.operator,delete t.value,delete t.visit,delete t.candidates,e.target.value&&(t.operator=e.target.value),this.props.updateRule(this.props.index,t)},valueChange:function(e){var t=JSON.parse(JSON.stringify(this.props.rule));delete t.visit,delete t.candidates,t.value=e.target.value,this.setState({value:e.target.value}),this.valueSet(),this.props.updateRule(this.props.index,t)},valueSet:function(){var e=JSON.parse(JSON.stringify(this.props.rule)),t=this;if(this.state.value){var a=function(a){var s,r={},i={};for(s=0;s<a.length;s++)r[a[s][1]]||(r[a[s][1]]=[]),r[a[s][1]].push(a[s][0]),i[a[s][0]]||(i[a[s][0]]=[]),i[a[s][0]].push(a[s][1]);e.candidates={allCandiates:i,allSessions:r},e.session=Object.keys(i),e.visit="All",t.props.updateSessions(t.props.index,e)},s=function(s){$.get(loris.BaseURL+"/AjaxHelper.php?Module=dataquery&script="+s,{category:e.instrument,field:e.field,value:t.state.value},a,"json")};switch(e.operator){case"equal":s("queryEqual.php");break;case"notEqual":s("queryNotEqual.php");break;case"lessThanEqual":s("queryLessThanEqual.php");break;case"greaterThanEqual":s("queryGreaterThanEqual.php");break;case"startsWith":s("queryStartsWith.php");break;case"contains":s("queryContains.php")}}},updateVisit:function(e){var t=JSON.parse(JSON.stringify(this.props.rule));t.visit=e.target.value,"all"===e.target.value?t.session=Object.keys(t.candidates.allCandiates):t.session=t.candidates.allSessions[e.target.value],this.props.updateSessions(this.props.index,t)},render:function(){var e,t,a,s,r=this;if(this.props.rule.instrument){var i,l,p,n,o,u,c=this.props.rule.fields.map(function(e,a){return r.props.rule.field&&e.key[1]===r.props.rule.field&&(t=a),React.createElement("option",{value:a},e.key[1])}),d=[];if(this.props.rule.fieldType){inputType=this.props.rule.fieldType.split("("),p=inputType[0];for(var h in this.state.operators)d.push(React.createElement("option",{value:h,onChange:this.operatorSelect},this.state.operators[h]));if(u=this.props.rule.operator?this.props.rule.operator:"",n=React.createElement("select",{className:"input-sm col-xs-3 ",onChange:this.operatorSelect,value:u},React.createElement("option",{value:""}),d),this.props.rule.operator)switch(p){case"enum":i=enumToArray(this.props.rule.fieldType),o=i.map(function(e){return React.createElement("option",{value:e},e)}),u=this.props.rule.value?this.props.rule.value:"",l=React.createElement("select",{className:"input-sm col-xs-3",onChange:this.valueChange,value:u},React.createElement("option",{value:""}),o);break;default:l=React.createElement("input",{type:"text",className:"input-sm col-xs-3",onChange:this.valueChange,value:this.props.rule.value})}this.props.rule.visit&&(s=Object.keys(this.props.Visits).map(function(e){return React.createElement("option",{value:e},e)}),a=React.createElement("select",{className:"input-sm col-xs-3",onChange:this.updateVisit,value:this.props.rule.visit},React.createElement("option",{value:"all"},"All Visits"),s))}e=React.createElement("div",null,React.createElement("div",{className:"col-xs-12"},React.createElement("label",{className:"instrumentLabel"},this.props.rule.instrument)),React.createElement("div",{className:"col-xs-10"},React.createElement("select",{className:"input-sm col-xs-3",onChange:this.fieldSelect,value:t},React.createElement("option",{value:""}),c),n,l,a))}else{var o=this.props.items.map(function(e){return React.createElement("option",{value:e.category},e.category)});e=React.createElement("select",{onChange:this.selectInstrument,className:"input-sm col-xs-10"},React.createElement("option",{value:""}),o)}return React.createElement("div",{className:"panel panel-default"},React.createElement("div",{className:"panel-body"},e,React.createElement("div",{className:"col-xs-2"},React.createElement("button",{className:"btn btn-danger btn-sm pull-right",onClick:this.props.deleteRule.bind(this,this.props.index)},React.createElement("span",{className:"glyphicon glyphicon-remove"})," Delete"))))}}),r=React.createClass({displayName:"FilterGroup",updateChild:function(e,t){var a=this.props.group;a.children[e]=t,this.props.index?this.props.updateGroup(this.props.index,a):this.props.updateFilter(a)},updateGroupOperator:function(e){var t=this.props.group;t.activeOperator=e,t.session=getSessions(t),this.props.index?this.props.updateGroup(this.props.index,t):this.props.updateFilter(t)},updateSessions:function(e,t){var a=this.props.group;a.children[e]=t,a.session=getSessions(a),this.props.index?this.props.updateSessions(this.props.index,a):this.props.updateFilter(a)},addChild:function(e){var t,a=this.props.group;t="rule"===e?{type:"rule"}:{type:"group",activeOperator:0,children:[{type:"rule"}]},a.children.push(t),this.props.index?this.props.updateGroup(this.props.index,a):this.props.updateFilter(a)},deleteChild:function(e){var t=this.props.group;t.children.splice(e,1),t.session=getSessions(t),this.props.index?this.props.updateGroup(this.props.index,t):this.props.updateFilter(t)},render:function(){var e,t=React.createElement(a,{logicOperator:this.props.group.activeOperator,updateGroupOperator:this.updateGroupOperator}),i=this,l=this.props.group.children.map(function(e,t){return"rule"===e.type?React.createElement("li",null,React.createElement(s,{rule:e,items:i.props.items,index:t,updateRule:i.updateChild,updateSessions:i.updateSessions,deleteRule:i.deleteChild,Visits:i.props.Visits})):"group"===e.type?React.createElement("li",null,React.createElement(r,{group:e,items:i.props.items,index:t,updateGroup:i.updateChild,updateSessions:i.updateSessions,deleteGroup:i.deleteChild,Visits:i.props.Visits})):void 0});return this.props.deleteGroup&&(e=React.createElement("button",{className:"btn btn-danger btn-sm pull-right",onClick:this.props.deleteGroup.bind(this,this.props.index)},React.createElement("span",{className:"glyphicon glyphicon-remove"})," Delete Group")),React.createElement("div",{className:"tree"},React.createElement("ul",{className:"firstUL"},React.createElement("li",null,React.createElement("div",{className:"row"},React.createElement("div",{className:"col-xs-2"},t),React.createElement("div",{className:"col-xs-10"},e,React.createElement("button",{className:"btn btn-primary btn-sm pull-right",onClick:this.addChild.bind(this,"group")},React.createElement("span",{className:"glyphicon glyphicon-add"})," Add Group"),React.createElement("button",{className:"btn btn-primary btn-sm pull-right",onClick:this.addChild.bind(this,"rule")},React.createElement("span",{className:"glyphicon glyphicon-add"})," Add Rule"))),React.createElement("ul",null,l))))}}),i=React.createClass({displayName:"FilterBuilder",render:function(){return React.createElement("div",null,React.createElement("h1",{className:"col-xs-12"},"Filter"),React.createElement("div",{className:"col-xs-12"},React.createElement("div",{className:"well well-primary"},React.createElement(r,{group:this.props.filter,items:this.props.items,updateFilter:this.props.updateFilter,Visits:this.props.Visits}))))}});window.LogicOperator=a,window.FilterRule=s,window.FilterGroup=r,window.FilterBuilder=i,t.default={LogicOperator:a,FilterRule:s,FilterGroup:r,FilterBuilder:i}}]);