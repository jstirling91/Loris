/**
 * This file contains React component for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */

import Page from './DirectEntryForm';

class DirectEntry extends React.Component {

	constructor(props) {
	    super(props);

	    const height = window.innerHeight / 3;
	    const style = {
	    	"margin-top": height
	    }
	    let page = -1;
		const url = new URL(window.location.href);

	    this.nextPage = this.nextPage.bind(this);
	    this.prevPage = this.prevPage.bind(this);
	    this.updateAnswer = this.updateAnswer.bind(this);
	    this.setupPageValues = this.setupPageValues.bind(this);
	    this.submit = this.submit.bind(this);

	    this.state = {
	    	style: style,
	    	page: page,
	    	values: {},
	    	errors: {},
	    	InstrumentJSON: {},
	    	completionStats: {
				total: 0,
				completed: 0
			},
			api_url: url.origin + "/survey_module/ajax/survey_api.php" + url.search
	    };

	}

	componentWillMount() {

		$.ajax({
		  url: this.state.api_url,
	      method: "GET",
	      dataType: 'json',
	      success: function(data) {
	        const InstrumentJSON = JSON.parse(data.InstrumentJSON);
	        const Values = JSON.parse(data.Values);
	        let page = -1;

	        if (
	        	InstrumentJSON.Elements[0].Type === 'ElementGroup' 
	        	&& InstrumentJSON.Elements[0].GroupType === 'Page'
	        ) {
	    		// The following Instrument has pages
	    		page = 0;
	    	}

	    	let total = 0;
			let completed = 0;
			for (let key in Values) {
				if(Values[key] != null && Values[key] != '') {
					completed++;
				}
				total++;
			}

	       	this.setState({
	       		values: Values,
	    		InstrumentJSON: InstrumentJSON,
	    		page: page,
	    		completionStats: {
					total: total,
					completed: completed
				}
	       	}, this.setupPageValues.bind(this, page));
	      }.bind(this)
	    }).fail((responseData) => {
			error_log("HERERERERER");
		});

		
	}

	setupPageValues(page) {
		const pageElements = this.state.InstrumentJSON.Elements[page].Elements;
		let pageValues = {};

		for (let i = 0; i < pageElements.length; i++) {
			const name = this.getElementName(pageElements[i]);
			if(name instanceof Array) {
				for(let j = 0; j < name.length; j++) {
					if(name[j] in this.state.values) {
						pageValues[name[j]] = this.state.values[name[j]];
					}
				}
			} else if(name in this.state.values) {
				pageValues[name] = this.state.values[name];
			}
		}

		this.setState({
	    	pageValues: pageValues
	    });
	}

	getElementName(element) {
		let name;
		if (element.Type === 'ElementGroup') {
			name = [];
			for(let i = 0; i < element.Elements.length; i++) {
				name.push(this.getElementName(element.Elements[i]));
			}
		} else {
			name = element.Name
		}

		return name;
	}

	nextPage() {

		let page = 0;
		let finalPage = false;
		if(this.state.page != 0) {
			page = this.state.InstrumentJSON.Elements[this.state.page].Subtest;
		}

		let data = {
			"data" : this.state.pageValues,
			"page" : page
		};
		const that = this;

		if(this.state.page === this.state.InstrumentJSON.Elements.length - 1) {
			data['FinalPage'] = true;
			finalPage = true;
		}

		$.ajax({
		    url : this.state.api_url,
		    data : JSON.stringify(data),
		    type : 'PUT',
		    contentType : 'application/json',
		    success : function(result){
		        const page = that.state.page + 1;
		        let InstrumentJSON;
		        let reviewPage;

		        if(finalPage) {
		        	InstrumentJSON = that.state.InstrumentJSON;
		        	reviewPage = JSON.parse(result);
		        } else {
		        	InstrumentJSON = JSON.parse(result);
		        }

		        that.setState({
					page: page,
					errors: {},
					InstrumentJSON: InstrumentJSON,
					ReviewData: reviewPage
				});

				that.setupPageValues(page);
				window.scrollTo(0,0);
		   },
		}).fail((responseData) => {
			if(responseData.status === 400) {
				const response = JSON.parse(responseData.responseText)
				this.setState({
					errors: response
				});
				alert("Please resolve page errors before continuing");
			}
		});

		
	}

	prevPage() {
		const page = this.state.page - 1;

        this.setState({
			page: page,
			errors: {}
		});
		this.setupPageValues(page);

		window.scrollTo(0,0);
	}

	updateAnswer(fieldName, value) {
		let data = {};
		data[fieldName] = value;

		$.ajax({
		    url : this.state.api_url,
		    data : JSON.stringify(data),
		    type : 'PATCH',
		    contentType : 'application/json'
		}); 

		this.setState(function(state) {
			let values = state.values;
			let pageValues = state.pageValues;
			let stats = state.completionStats;

			if(values[fieldName] == null || values[fieldName] == '') {
				stats.completed = stats.completed + 1;
			} else if (value == null || value == '') {
				stats.completed = stats.completed - 1;
			}

			values[fieldName] = value;
			pageValues[fieldName] = value;
			return {
				values: values,
				pageValues: pageValues,
				completionStats: stats
			}
		});
	}

	submit() {
		$.ajax({
		    url : this.state.api_url,
		    type : 'POST',
		    contentType : 'application/json'
		}); 
	}

	render() {
		if(!this.state.InstrumentJSON.Elements){
			// Since the Instrument data is set when the component is
			// mounted we want to display nothing until it has been set
			return (
				<div></div>
			);
		}
		let DirectEntryFormElements;
		let buttons;
		if (this.state.page === this.state.InstrumentJSON.Elements.length) {
			DirectEntryFormElements = (
				<ReviewPage reviewData={this.state.ReviewData} />
			);
		} else if (this.state.page >= 0) {
			DirectEntryFormElements = (
				<Page
					elements={this.state.InstrumentJSON.Elements[this.state.page].Elements}
					values={this.state.values}
					updateAnswer={this.updateAnswer}
					errors={this.state.errors}
				/>
			);
		} else {
			DirectEntryFormElements = (
				<Page
					elements={this.state.InstrumentJSON.Elements}
					values={this.state.values}
					updateAnswer={this.updateAnswer}
					errors={this.state.errors}
				/>
			);
		}
			
		if (this.state.page === this.state.InstrumentJSON.Elements.length) {
			buttons = (
				<div>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.prevPage}>Prev</button>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.submit}>Submit</button>
				 </div>
			 );
		} else if (this.state.page === -1 || (this.state.page === 0 && this.state.InstrumentJSON.Elements.length === 1)) {
			 buttons = (
			 	<button type="button" className="btn btn-primary btn-lg">Done</button>
			 );
		} else if (this.state.page === 0) {
			buttons = (
			 	<button type="button" className="btn btn-primary btn-lg" onClick={this.nextPage}>Next</button>
			 );
		} else if (this.state.page === this.state.InstrumentJSON.Elements.length - 1) {
			buttons = (
				<div>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.prevPage}>Prev</button>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.nextPage}>Done</button>
				 </div>
			 );
		} else {
			buttons = (
				<div>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.prevPage}>Prev</button>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.nextPage}>Next</button>
				</div>
			 );
		}
		const style = {
			width: this.state.completionStats.completed / this.state.completionStats.total * 100 + '%'
		}
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
  					<span className="h1" className="navbar-brand">LORIS</span>
				</nav>
				<div id='page' className='container-fluid'>
					{DirectEntryFormElements}
					<div className='question-container col-xs-12 col-sm-10 col-sm-offset-1'>
						{buttons}
					</div>
				</div>
				<div className="navbar navbar-default navbar-fixed-bottom">
					<div className="col-xs-5 footer-bar">
						{this.state.completionStats.completed} of {this.state.completionStats.total} Answered
					</div>
				    <div className="col-xs-4 footer-bar">
				      	<div className="progress">
						  <div className="progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={style}>
						    &nbsp;
						  </div>
						</div>
				    </div>
			    </div>
			</div>
		);
	}
}

class ReviewPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		let questions = this.props.reviewData.questions.map((element) => {
			console.log(element);
			return (
				<tr className='reviewPage'>
					<td>{element.question}</td>
					<td>{element.response}</td>
				</tr>
			);
		});

		return (
			<div className='question-container col-xs-12 col-sm-10 col-sm-offset-1'>
				<h3>Review You Submission</h3>
				<table className="table table-striped table-bordered">
					
					<tbody>
					{questions}
					</tbody>
				</table>
			</div>
		)
	}	
}

window.DirectEntry = DirectEntry;

export default DirectEntry;