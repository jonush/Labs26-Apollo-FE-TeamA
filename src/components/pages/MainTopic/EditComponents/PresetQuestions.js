import React, { useState, useEffect } from "react";
import { Form, Select, Divider } from "antd";
import { getQuestions } from "../../../../api/index";

const PresetContextQuestions = props => {
  const [inputs, setInputs] = useState([]);
  const { Option } = Select;

  // retrieve all context questions from the API /question
  useEffect(() => {
    getQuestions()
      .then(res => {
        getFields(res);
        console.log(props.contextQ);
      })
      .catch(err => console.log(err));
  }, [props.contextQ]);

  // loading questions from API /question into state
  const handleContextQuestions = cq => {
    let options = [];
    for (let i = 0; i < cq.length; i++) {
      if (
        // cq[i].contextid === props.value.contextid &&
        cq[i].type === "Context Questions"
      ) {
        options.push(cq[i]);
      }
    }
    return options;
  };

  // creating an Option for each question in state
  const loadQuestions = async res => {
    const initialQuestions = await handleContextQuestions(res);
    const count = initialQuestions.length;
    const children = [];
    for (let i = 0; i < count; i++) {
      children.push(
        <Option
          key={i}
          value={[initialQuestions[i].question, initialQuestions[i].id]}
        >
          {initialQuestions[i].question}
        </Option>
      );
    }
    return children;
  };

  const getFields = async res => {
    const presets = await loadQuestions(res);
    const children = [];
    for (let i = 0; i < props.contextQ.length; i++) {
      children.push(
        <div>
          <Divider>Context Question</Divider>

          <Form.Item
            name={["oldCQ", `${props.contextQ[i][0].id}`]}
            rules={[{ required: true }]}
            initialValue={[
              props.contextQ[i][0].question,
              props.contextQ[i][0].id
            ]}
          >
            <Select placeholder={props.contextQ[i][0].question}>
              {presets}
            </Select>
          </Form.Item>
        </div>
      );
    }
    setInputs(children);
  };

  return (
    <>
      <div>{inputs}</div>
    </>
  );
};

export default PresetContextQuestions;