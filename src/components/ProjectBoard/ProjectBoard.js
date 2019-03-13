import React, { Component } from "react";
import { Link } from "react-router-dom";
import Backlog from "./Backlog";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBacklog, updateSort } from "../../actions/backlogActions";

class ProjectBoard extends Component {
  //constructor to handle errors
  constructor() {
    super();
    this.state = {
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
  }

  async onChange(e) {
    const { id } = this.props.match.params;
    await this.props.updateSort(id, e.target.value);
    this.props.getBacklog(id);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBacklog(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { project_tasks } = this.props.backlog;
    const { errors } = this.state;

    let BoardContent;

    const boardAlgorithm = (errors, project_tasks) => {
      if (project_tasks.length < 1) {
        if (errors.projectNotFound) {
          return (
            <div className="alert alert-danger text-center" role="alert">
              {errors.projectNotFound}
            </div>
          );
        } else if (errors.projectIdentifier) {
          return (
            <div className="alert alert-danger text-center" role="alert">
              {errors.projectIdentifier}
            </div>
          );
        } else {
          return (
            <div className="alert alert-info text-center" role="alert">
              No Project Tasks on this board
            </div>
          );
        }
      } else {
        return <Backlog project_tasks_prop={project_tasks} />;
      }
    };

    BoardContent = boardAlgorithm(errors, project_tasks);

    return (
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">DashBoard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {id}
            </li>
          </ol>
        </nav>

        <Link to={`/addProjectTask/${id}`} className="btn btn-primary mb-3">
          <i className="fas fa-plus-circle"> Create Project Task</i>
        </Link>

        <br />
        <div
          className="btn-group"
          role="group"
          value="0"
          onClick={this.onChange}
        >
          <button className="btn btn-primary" type="button" disabled>
            Sort By:
          </button>

          <button value={1} type="button" className="btn btn-primary">
            Due Date
          </button>
          <button value={2} type="button" className="btn btn-primary">
            Priority
          </button>
          <button value={3} type="button" className="btn btn-primary">
            Project Sequence
          </button>
        </div>

        <br />
        <hr />
        {BoardContent}
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  backlog: PropTypes.object.isRequired,
  getBacklog: PropTypes.func.isRequired,
  updateSort: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  backlog: state.backlog,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBacklog, updateSort }
)(ProjectBoard);
