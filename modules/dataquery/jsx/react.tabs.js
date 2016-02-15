TabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            <div className={classList} id={this.props.TabId}>
                <h1>{this.props.Title}</h1>
                {this.props.children}
            </div>
            );
    }
});

InfoTabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return <TabPane Title="Welcome to the Data Query Tool"
                    TabId={this.props.TabId} Active={true}>
                        <p>Data was last updated on {this.props.UpdatedTime}.</p>
                        <p>Please define or use your query by using the following tabs.</p>
                            <dl>
                            <dt>Define Fields</dt>
                            <dd>Define the fields to be added to your query here.</dd>
                            <dt>Define Filters</dt>
                            <dd>Define the criteria to filter the data for your query here.</dd>
                            <dt>View Data</dt>
                            <dd>See the results of your query.</dd>
                            <dt>Statistical Analysis</dt>
                            <dd>Visualize or see basic statistical measures from your query here.</dd>
                            <dt>Load Saved Query</dt>
                            <dd>Load a previously saved query (by name) by selecting from this menu.</dd>
                            <dt>Manage Saved Queries</dt>
                            <dd>Either save your current query or see the criteria of previously saved quer  ies here.</dd>
                          </dl>
                </TabPane>
    }
});

FieldSelectTabPane = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return <TabPane TabId={this.props.TabId}>
                    <FieldSelector title="Fields"
                        items={this.props.categories}
                        onFieldChange={this.props.onFieldChange}
                        selectedFields={this.props.selectedFields}
                    />
            </TabPane>
    }

});

FilterSelectTabPane = React.createClass({
    render: function() {
        // return <TabPane TabId={this.props.TabId}>
        //             <FieldSelector title="Filters"
        //                 items={this.props.categories}
        //                 type="Criteria"
        //                 onFieldChange={this.props.onFieldChange}
        //                 onCriteriaChange={this.props.onCriteriaChange}
        //                 selectedFields={this.props.selectedFields} Criteria={this.props.Criteria}
        //             />
        //        </TabPane>
        return (
            <TabPane TabId={this.props.TabId}>
                <FilterBuilder items={this.props.categories}
                               updateFilter={this.props.updateFilter}
                               filter={this.props.filter}
                />
            </TabPane>
        );
    }
});

ViewDataTabPane = React.createClass({
    getInitialState: function() {
        return { 'sessions' : [] }
    },
    runQuery: function() {
        if(this.props.onRunQueryClicked) {
            this.props.onRunQueryClicked(this.props.Fields, this.props.Sessions);
        }
    },
    downloadCSV: function() {
        var headers = this.props.Fields,
            csvworker = new Worker('GetJS.php?Module=dataquery&file=workers/savecsv.js');


        csvworker.addEventListener('message', function (e) {
            var dataURL, dataDate, link;
            if (e.data.cmd === 'SaveCSV') {
                dataDate = new Date().toISOString();
                dataURL = window.URL.createObjectURL(e.data.message);
                link = document.createElement("a");
                link.download = "data-" + dataDate + ".csv";
                link.type = "text/csv";
                link.href = dataURL;
                $(link)[0].click();

            }
        });
        csvworker.postMessage({
            cmd: 'SaveFile',
            data: this.props.Data,
            headers: headers,
            identifiers: this.props.Sessions
        });
    },
    changeDataDisplay: function(displayID) {
        this.props.changeDataDisplay(displayID);
    },
    render: function() {
        var buttons = (
            <div className="commands col-xs-12 form-group">
                <button className="btn btn-primary" onClick={this.runQuery}>Run Query</button>
                <button className="btn btn-primary" onClick={this.downloadCSV}>Download Table as CSV</button>
            </div>
            );
        var criteria = [];
        for (var el in  this.props.Criteria) {
            if(!this.props.Criteria.hasOwnProperty(el)) {
                continue;
            }
            var item = this.props.Criteria[el];
            if(item === undefined) {
                criteria.push(
                    <div className="alert alert-warning" role="alert">
                        {el} has been added as a filter but not had criteria defined.
                    </div>
                );
            } else {
                criteria.push(
                    <div className="row">
                        <span className="col-sm-3">{el}</span>
                        <span className="col-sm-3">{item.operator}</span>
                        <span className="col-sm-3">{item.value}</span>
                    </div>
                    );
            }

        }
        return <TabPane TabId={this.props.TabId}>
                    <h2>Query Criteria</h2>{criteria} {buttons}
                    <div className='form-group form-horizontal col-xs-12'>
                        <label for="selected-input" className="col-sm-1 control-label">Data</label>
                        <div className="col-sm-4">
                            <div className="btn-group">
                                <button id="selected-input" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                    <span id="search_concept">{this.props.displayType}</span>
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu" role="menu">
                                    <li onClick={this.changeDataDisplay.bind(this, 0)}>
                                        <div className="col-sm-12">
                                            <h5 className="">Cross-sectional</h5>
                                        </div>
                                    </li>
                                    <li onClick={this.changeDataDisplay.bind(this, 1)}>
                                        <div className="col-sm-12">
                                            <h5 className="">Longitudial</h5>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <StaticDataTable
                        Headers={this.props.RowHeaders}
                        RowNumLabel="Identifiers"
                        Data={this.props.Data}
                        RowNameMap={this.props.RowInfo}
                    />
               </TabPane>
    }
});

ScatterplotGraph = React.createClass({
    lsFit: function (data) {
        var i = 0,
            means = jStat(data).mean(),
            xmean = means[0],
            ymean = means[1],
            interim = 0,
            numerator  = 0,
            denominator = 0,
            slope,
            xi,
            yi;

            for (i = 0; i < data.length; i += 1) {
                xi = data[i][0];
                yi = data[i][1];
                numerator += (xi - xmean) * (yi - ymean);
                denominator += ((xi - xmean) * (xi - xmean));
            }

            slope = numerator / denominator;

            return [(ymean - slope * xmean), slope];
    },
    minmaxx: function (arr) {
        var i, min, max;

        for (i = 0; i < arr.length; i += 1) {
            if (arr[i][0] < min || min === undefined) {
                if (arr[i][0] !== undefined && arr[i][0] !== null) {
                    min = arr[i][0];
                }
            }
            if (arr[i][0] > max || max === undefined) {
                if (arr[i][0] !== undefined && arr[i][0] !== null) {
                    max = arr[i][0];
                }
            }
        }
        return [min, max];
    },
    updateScatterplot: function() {
        var xaxis = document.getElementById("scatter-xaxis").value,
            yaxis = document.getElementById("scatter-yaxis").value,
            grouping = document.getElementById("scatter-group").value,
            data = this.props.Data,
            points = [],
            min,
            max,
            field1 = [],
            field2 = [],
            grouped_points = {},
            i = 0,
            group_label,
            minmax,
            LS,
            slope,
            start,
            plots = [],
            label,
            plotY = function (x) { return [x, start + (slope * x)]; },
            dataset;

        for (i = 0; i < data.length; i += 1) {
            points.push([data[i][xaxis], data[i][yaxis]]);
            field1.push(data[i][xaxis]);
            field2.push(data[i][yaxis]);
            if (grouping) {
                group_label = data[i][grouping];
                if (!(grouped_points[group_label] instanceof Array)) {
                    grouped_points[group_label] = [];
                }
                grouped_points[group_label].push([data[i][xaxis], data[i][yaxis]]);
            }
        }



        if (grouping === 'ungrouped') {
            minmax = this.minmaxx(points);
            min = minmax[0];
            max = minmax[1];
            LS = this.lsFit(points);
            slope = LS[1];
            start = LS[0];

            $.plot("#scatterplotdiv", [{

                label: 'Data Points',
                data: points,
                points: { show: true }
            }, // Least Squares Fit
                {
                    label: 'Least Squares Fit',
                    data: jStat.seq(min, max, 3, plotY),
                    lines: { show: true }
                }], {});
        } else {
            minmax = this.minmaxx(points);
            min = minmax[0];
            max = minmax[1];
            i = 0;

            for (dataset in grouped_points) {
                if (grouped_points.hasOwnProperty(dataset)) {
                    label = document.getElementById("scatter-group").selectedOptions.item(0).textContent + " = " + dataset;
                    plots.push({
                        color: i,
                        label: dataset,
                        data: grouped_points[dataset],
                        points: { show: true }
                    });
                    LS = this.lsFit(grouped_points[dataset]);
                    //LS = lsFit(grouped_points[dataset].convertNumbers());
                    slope = LS[1];
                    start = LS[0];
                    plots.push({
                        color: i,
                        // label: "LS Fit for " + dataset,
                        data: jStat.seq(min, max, 3, plotY),
                        lines: { show: true }
                    });
                    i += 1;
                }
            }
            $.plot("#scatterplotdiv", plots, {});
        }

        $("#correlationtbl tbody").children().remove();
        $("#correlationtbl tbody").append("<tr><td>" + jStat.covariance(field1, field2) + "</td><td>" + jStat.corrcoeff(field1, field2) + "</td></tr>");
    },
    render: function() {
        var options = this.props.Fields.map(function(element, key){
                console.log(element);
                return (
                    <option value={key}>
                        {element}
                    </option>
                );
            })
            scatterStyle = {
                width: "500px",
                height: "500px"
            };
        return (
            <div>
                <h2>Scatterplot</h2>

                <div className="col-xs-4 col-md-3">
                    Column for X Axis
                </div>
                <div className="col-xs-8 col-md-3">
                    <select id="scatter-xaxis" onChange={this.updateScatterplot}>
                        <option>None</option>
                        {options}
                    </select>
                </div>

                <div className="col-xs-4 col-md-3">
                    Column for Y Axis
                </div>
                <div className="col-xs-8 col-md-3">
                    <select id="scatter-yaxis" onChange={this.updateScatterplot}>
                        <option>None</option>
                        {options}
                    </select>
                </div>

                <div className="col-xs-4 col-md-3">
                    Group by column
                </div>
                <div className="col-xs-8 col-md-3">
                    <select id="scatter-group" onChange={this.updateScatterplot}>
                        <option>None</option>
                        {options}
                    </select>
                </div>
                <h3>Scatterplot</h3>
                <div id="scatterplotdiv" style={scatterStyle}></div>
                <h3>Statistics</h3>
                <table id="correlationtbl">
                    <thead>
                        <tr>
                            <th>Covariance</th>
                            <th>Correlation Coefficient</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        );
    }
});
StatsVisualizationTabPane = React.createClass({
    getDefaultProps: function() {
        return {
            'Data' : []
        };
    },
    getInitialState: function() {
        return {
            'displayed': false
        }
    },
    render: function() {
        // if(this.state.displayed === false) {
        //     var content = <div>Statistics not yet calculated.</div>;
        //     // return <TabPane content={content} TabId={this.props.TabId} />;
        // } else 
        if(this.props.Data.length === 0) {
            var content = <div>Could not calculate stats, query not run</div>;
            // return <TabPane content={content} TabId={this.props.TabId} />;
        } else {
            var stats = jStat(this.props.Data),
                min = stats.min(),
                max = stats.max(),
                stddev = stats.stdev(),
                mean = stats.mean(),
                meandev = stats.meandev(),
                meansqerr = stats.meansqerr(),
                quartiles = stats.quartiles(),
                rows = [];


            for(var i = 0; i < this.props.Fields.length; i += 1) {
                rows.push(<tr>
                    <td>{this.props.Fields[i]}</td>
                    <td>{min[i]}</td>
                    <td>{max[i]}</td>
                    <td>{stddev[i]}</td>
                    <td>{mean[i]}</td>
                    <td>{meandev[i]}</td>
                    <td>{meansqerr[i]}</td>
                    <td>{quartiles[i][0]}</td>
                    <td>{quartiles[i][1]}</td>
                    <td>{quartiles[i][2]}</td>
                </tr>);
            }

            var statsTable = (
                <table className="table table-hover table-primary table-bordered colm-freeze">
                    <thead>
                        <tr className="info">
                            <th>Measure</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Standard Deviation</th>
                            <th>Mean</th>
                            <th>Mean Deviation</th>
                            <th>Mean Squared Error</th>
                            <th>First Quartile</th>
                            <th>Second Quartile</th>
                            <th>Third Quartile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            );

            var content = (
                <div>
                    <h2>Basic Statistics</h2>
                    {statsTable}

                    <ScatterplotGraph
                        Fields={this.props.Fields}
                        Data={this.props.Data}
                    />
                </div>
            );
        }
        return (
            <TabPane TabId={this.props.TabId}>
                {content}
            </TabPane>
        );
    }
});

SaveQueryDialog = React.createClass({
    getInitialState: function() {
        return {
            'queryName' : '',
            'shared' : false
        };
    },
    editName: function(e) {
        this.setState({ queryName : e.target.value });
    },
    editPublic: function(e) {
        this.setState({ shared : e.target.checked });
    },
    onSaveClicked: function() {
        // Should do validation before doing anything here.. ie query name is entered, doesn't already
        // exist, there are fields selected..
        if(this.props.onSaveClicked) {
            this.props.onSaveClicked(this.state.queryName, this.state.shared);
        }
    },
    onDismissClicked: function() {
        if(this.props.onDismissClicked) {
            this.props.onDismissClicked();
        }
    },
    render: function() {
        return (
            <div className="modal show">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={this.onDismissClicked}><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">Save Current Query</h4>
                        </div>
                        <div className="modal-body">
                            <p>Enter the name you would like to save your query under here:</p>
                            <div className="input-group">
                                Query Name: <input type="text" className="form-control" placeholder="My Query" value={this.state.queryName} onChange={this.editName} />
                            </div>
                            <p>Make query a publicly shared query? <input type="checkbox" checked={this.state.shared ? 'checked' : ''} onChange={this.editPublic} aria-label="Shared Query" /></p>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.onDismissClicked}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.onSaveClicked} >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});
ManageSavedQueryRow = React.createClass({
    getDefaultProps: function() {
        return {
            'Name': 'Unknown',
            'Query': {
                'Fields': []
            }
        }
    },
    render: function() {
        var fields = [];
        var filters = [];
        if(this.props.Query.Fields) {
            for(var i = 0; i < this.props.Query.Fields.length; i += 1) {
                fields.push(<li>{this.props.Query.Fields[i]}</li>);
            }
        }

        if(fields.length === 0) {
            fields.push(<li>No fields defined</li>);
        }

        if(this.props.Query.Conditions) {
            for(var i = 0; i < this.props.Query.Conditions.length; i += 1) {
                var filter = this.props.Query.Conditions[i];
                filters.push(<li>{filter.Field} {filter.Operator} {filter.Value}</li>);
            }
        }
        if(filters.length === 0) {
            filters.push(<li>No filters defined</li>);
        }
        return (
                    <tr>
                        <td>{this.props.Name}</td>
                        <td><ul>{fields}</ul></td>
                        <td><ul>{filters}</ul></td>
                    </tr>
        );
    }
});
ManageSavedQueriesTabPane = React.createClass({
    dismissDialog: function() {
        this.setState({ 'savePrompt' : false });
    },
    getInitialState: function() {
        return {
            'savePrompt' : false,
            'queriesLoaded' : false,
            'queries' : {}
        };
    },
    saveQuery: function() {
        this.setState({ 'savePrompt' : true });
    },
    savedQuery: function(name, shared) {
        if(this.props.onSaveQuery) {
            this.props.onSaveQuery(name, shared);
        }
        this.setState({ 'savePrompt' : false });
    },
    getDefaultProps: function() {
        return {
            userQueries: [],
            globalQueries: [],
            queriesLoaded: false,
            queryDetails: {}
        };
    },
    render: function() {
        var queryRows = [];
        if(this.props.queriesLoaded) {
            for(var i = 0; i < this.props.userQueries.length; i += 1) {
                var query = this.props.queryDetails[this.props.userQueries[i]];
                var name = "Unnamed Query: " + this.props.userQueries[i];
                if(query.Meta.name) {
                    name = query.Meta.name;
                }

                queryRows.push(
                        <ManageSavedQueryRow Name={name} Query={query} />
                    );

            }
        } else {
            queryRows.push(
                <tr>
                    <td colSpan="3">Loading saved query details</td>
                </tr>
            );
        }

        var savePrompt = '';
        if(this.state.savePrompt) {
            savePrompt = <SaveQueryDialog onDismissClicked={this.dismissDialog} onSaveClicked={this.savedQuery}/>;

        }
        var content = (
            <div>
                <h2>Your currently saved queries</h2>
                <button onClick={this.saveQuery}>Save Current Query</button>
                <table className="table table-hover table-primary table-bordered colm-freeze">
                    <thead>
                        <tr className="info">
                            <th>Query Name</th>
                            <th>Fields</th>
                            <th>Filters</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queryRows}
                    </tbody>
                </table>
                {savePrompt}
            </div>
        );
        return (
            <TabPane TabId={this.props.TabId}>
                {content}
            </TabPane>
        );
    }
});