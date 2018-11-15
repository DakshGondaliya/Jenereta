import React, { Component } from "react";
import { Button, Label, Col, Input, Row, Form, FormFeedback } from "reactstrap";
import PropTypes from "prop-types";
import classnames from "classnames";
import EachSlot from "./EachSlot";
import Spinner from "../common/Spinner";
import { getCurrentSubject } from "../../actions/subjectActions";
import { getCurrentTeacher } from "../../actions/teacherActions";
import { getCurrentClass } from "../../actions/classActions";
import { getCurrentSlot, createSlot } from "../../actions/slotActions";
import { connect } from "react-redux";
import { generate } from "../../utils/generator";
// import { withRouter } from "react-dom";

class Slots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // slot: [
      //   {
      //     teacher: "",
      //     sections: "",
      //     subject: "",
      //     numLectures: "",
      //     numLabs: null
      //   }
      // ],
      numLectures: "",
      teacher: "",
      sections: "",
      subject: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const slotData = {
      numLectures: this.state.numLectures,
      teacher: this.state.teacher,
      sections: this.state.sections,
      subject: this.state.subject
    };
    this.props.createSlot(slotData);
    // this.forceUpdate();
    this.setState({
      numLectures: "",
      teacher: "",
      sections: "",
      subject: "",
      errors: {}
    });
  }

  componentDidMount() {
    this.props.getCurrentSubject();
    this.props.getCurrentClass();
    this.props.getCurrentTeacher();
    this.props.getCurrentSlot();
  }

  generator(e) {
    e.preventDefault();
    //    this.props.history.push("/display-time-table");
    generate(
      [
        {
          teacher: "T1",
          sections: ["12A"],
          subject: "English",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T2",
          sections: ["12A"],
          subject: "Hindi",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T3",
          sections: ["12A"],
          subject: "Maths",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T4",
          sections: ["12A"],
          subject: "Science",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T1",
          sections: ["12B"],
          subject: "English",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T2",
          sections: ["12B"],
          subject: "Hindi",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T3",
          sections: ["12B"],
          subject: "Maths",
          numLectures: "10",
          numLabs: null
        },
        {
          teacher: "T4",
          sections: ["12B"],
          subject: "Science",
          numLectures: "10",
          numLabs: null
        }
      ],
      [8, 8, 8, 8, 8, 5],
      ["T1", "T2", "T3", "T4", "T5", "T6"],
      ["12A", "12B"]
    );
  }

  render() {
    const { user } = this.props.auth;
    const { slot, loading } = this.props.slot;
    let slotContent;
    const { errors } = this.state;
    const { subject } = this.props.subject;
    const { classes } = this.props.classes;
    const { teacher } = this.props.teacher;
    let subjects, section, tchr;
    if (!subject) subjects = <option disabled>Loading</option>;
    else {
      if (!subject.subject) subjects = <option disabled>Loading</option>;
      else {
        subjects = subject.subject.map(subject => (
          <option key={subject}>{subject}</option>
        ));
      }
    }
    if (!teacher) tchr = <option disabled>Loading</option>;
    else {
      if (!teacher.teachersName) tchr = <option disabled>Loading</option>;
      else {
        tchr = teacher.teachersName.map(tchrs => (
          <option key={tchrs}>{tchrs}</option>
        ));
      }
    }
    if (!classes) section = <option disabled>Loading</option>;
    else {
      if (!classes.classAndsec) section = <option disabled>Loading</option>;
      else {
        section = classes.classAndsec.map(cls => (
          <option key={cls}>{cls}</option>
        ));
      }
    }

    if (slot === null || loading) {
      slotContent = <Spinner />;
    } else {
      let a = false;
      // Check if logged in user has subject data
      if (slot.slots !== undefined) {
        if (slot.slots.length > 0) {
          a = true;
        }
      }
      if (Object.keys(slot).length > 0 && a) {
        slotContent = (
          <div>
            <EachSlot slots={slot.slots} />
          </div>
        );
      } else {
        //User is logged in but has no slot
        slotContent = (
          <div>
            <div>
              <p className="lead text-muted">Welcome {user.name}</p>
              <p>You do not have any Slot, please add some </p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="mt-5">
        <Form onSubmit={this.onSubmit}>
          <Row>
            <Col md={{ size: 3, offset: 0.5 }}>
              <Label>Teacher</Label>
              <Input
                type="select"
                name="teacher"
                id="teacher"
                onChange={this.onChange}
                value={this.state.teacher}
                className={classnames("fa fa-search form-control-feedback", {
                  "is-invalid": errors.teacher
                })}
              >
                <option>Select</option>
                {tchr}
              </Input>
              <FormFeedback>{errors.teacher}</FormFeedback>
            </Col>
            <Col md={{ size: 3, offset: 0.5 }}>
              <Label>Class-Section</Label>
              <Input
                type="select"
                name="sections"
                id="sections"
                onChange={this.onChange}
                value={this.state.sections}
                className={classnames("fa fa-search form-control-feedback", {
                  "is-invalid": errors.sections
                })}
              >
                <option>Select</option>
                {section}
              </Input>
              <FormFeedback>{errors.sections}</FormFeedback>
            </Col>
            <Col md={{ size: 3, offset: 0.5 }}>
              <Label>Subject</Label>
              <Input
                type="select"
                name="subject"
                id="subject"
                onChange={this.onChange}
                value={this.state.subject}
                className={classnames("fa fa-search form-control-feedback", {
                  "is-invalid": errors.subject
                })}
              >
                <option>Select</option>
                {subjects}
              </Input>
              <FormFeedback>{errors.subject}</FormFeedback>
            </Col>
            <Col md={{ size: 2, offset: 0.5 }}>
              <Label>No. Of Lectures</Label>
              <Input
                type="number"
                name="numLectures"
                placeholder="No. of lectures"
                id="numLectures"
                onChange={this.onChange}
                value={this.state.numLectures}
                className={classnames("fa fa-search form-control-feedback", {
                  "is-invalid": errors.numLectures
                })}
              />
              <FormFeedback>{errors.numLectures}</FormFeedback>
            </Col>
            <Col md={{ size: 1, offset: 0.5 }}>
              <Label> - </Label>
              <Button type="submit" color="primary">
                Add
              </Button>
            </Col>
          </Row>
        </Form>
        <div
          style={{ float: "right", marginLeft: "20px", marginBottom: "10px" }}
        >
          <Button onClick={this.generator} className="btn">
            Generate Time-Table
          </Button>
        </div>
        <Row className="display-4" style={{ marginLeft: 50, marginTop: 25 }}>
          {slotContent}
        </Row>
      </div>
    );
  }
}

Slots.propTypes = {
  getCurrentSubject: PropTypes.func.isRequired,
  getCurrentClass: PropTypes.func.isRequired,
  getCurrentTeacher: PropTypes.func.isRequired,
  getCurrentSlot: PropTypes.func.isRequired,
  createSlot: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  subject: PropTypes.object.isRequired,
  teacher: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  subject: state.subject,
  teacher: state.teacher,
  classes: state.classes,
  errors: state.errors,
  slot: state.slot,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getCurrentSubject,
    getCurrentTeacher,
    getCurrentClass,
    getCurrentSlot,
    createSlot
  }
)(Slots);
