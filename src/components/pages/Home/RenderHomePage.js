import React, { useState, useEffect } from "react";
import { Button } from "antd";
import TopicsList from "../../home_components/TopicsList";
import NewTopicContainer from "../NewTopic/NewTopicContainer";
import MainTopic from "../MainTopic/MainTopicContainer";
import { TopicListContext } from "../../../state/contexts/TopicListContext";
import Responses from "../../home_components/Responses";
import { ResponsesContext } from "../../../state/contexts/ResponsesContext";
import ThreadsList from "../../home_components/ThreadsList";
import { ThreadsContext } from "../../../state/contexts/ThreadsContext";
import { QuestionsContext } from "../../../state/contexts/QuestionsContext";
import { TopicQuestionsContext } from "../../../state/contexts/TopicQuestionsContext";
import { RequestsContext } from "../../../state/contexts/RequestsContext";
import { SurveyRequestsContext } from "../../../state/contexts/SurveyRequestsContext";
import SurveyRequest from "../SurveyRequest/SurveyRequestContainer";
import { SurveyContextContext } from "../../../state/contexts/SurveyContextContext";
import JoinTopic from "./JoinTopic";
import axios from "axios";
import {
  getAllRequestResponses,
  getAllTopics,
  getAllThreads,
  getAllSurveyRequest,
  getToken,
  getAllTopicRequestQuestions,
  getAllTopicContextQuestions,
  getContextQuestionByID,
  getRequestQuestionByID,
  getProfile
} from "../../../api/index";
import { RequestSurvey } from "../SurveyRequest";

function RenderHomePage(props) {
  // state handlers
  const { userInfo, authService } = props;
  const [topics, setTopics] = useState([]);
  const [topicID, setTopicID] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [responseList, setResponses] = useState([]);
  const [threads, setThreads] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [requestID, setRequestID] = useState(0);
  const [responseID, setResponseID] = useState(0);
  const [surveyContextForm, setSurveyContextForm] = useState([]);
  const [surveyRequestForm, setSurveyRequestForm] = useState([]);
  const page = 1;

  useEffect(() => {
    getAllTopics()
      .then(res => {
        let userTopics = res.filter(topic => topic.leaderid === userInfo.sub);
        setTopics(userTopics);
      })
      .catch(err => console.log(err));
  }, [topicID]);

  // for selecting a specific topic
  const getTopicID = id => {
    setTopicID(id);
  };

  // used when deleting a topic
  const resetTopicID = () => {
    setTopicID(0);
    setRequestID(0);
    setResponseID(0);
  };

  const getSurveyRequests = id => {
    getAllSurveyRequest()
      .then(res => {
        let TopicRequest = res.filter(req => req.topicid === id);
        setRequestsList(TopicRequest);
        // console.log("getAllSurveyRequests", res);
        // console.log("getAllSurveyRequests -> requestsList", requestsList);
      })
      .catch(err => console.log("getAllResponses", err));
  };

  const resetReqAndResID = () => {
    setResponseID(0);
    setRequestID(0);
  };

  const getSurveyContextForm = id => {
    console.log("getSurveyContextForm FIRED");
    getAllTopicContextQuestions()
      .then(res => {
        const TopicCont = res.filter(question => question.topicid === id);
        setSurveyContextForm(TopicCont);

        console.log("getSurveyContextForm -> TopicCont", TopicCont);
        console.log("getSurveyContextForm -> getAllTopicContextQuestions", res);
        axios
          .all(
            TopicCont.map(item => {
              getContextQuestionByID(item.contextquestionid)
                .then(res => {
                  item.contextquestionid = res;
                })
                .catch(err => console.log("getContextQuestionByID", err));
            })
          )
          .then(res => {
            console.log(
              "getSurveyContextForm -> axios.all(TopicCont).res: ",
              res
            );
          })
          .catch(err =>
            console.log("getSurveyContextForm -> axios.all()", err)
          );

        setSurveyContextForm(TopicCont);
      })
      .catch(err =>
        console.log("getSurveyContextForm -> getAllTopicContextQuestions", err)
      );

    console.log(
      "getSurveyContextForm -> setSurveyContextForm(newQuestion)",
      surveyContextForm
    );
  };
  const getSurveyRequestForm = id => {
    console.log("getSurveyRequestForm FIRED");
    getAllTopicRequestQuestions()
      .then(res => {
        const TopicReq = res.filter(question => question.topicid === id);
        console.log("getSurveyRequestForm -> TopicReq", TopicReq);
        console.log("getSurveyRequestForm -> getAllTopicRequestQuestions", res);
        axios
          .all(
            TopicReq.map(item => {
              getRequestQuestionByID(item.requestquestionid)
                .then(res => {
                  item.requestquestionid = res;
                })
                .catch(err => console.log("getRequestQuestionByID", err));
            })
          )
          .then(res => {
            console.log(
              "getSurveyRequestForm -> axios.all(TopicReq).res: ",
              res
            );
          })
          .catch(err =>
            console.log("getSurveyRequestForm -> axios.all()", err)
          );
        setSurveyRequestForm(TopicReq);
      })
      .catch(err =>
        console.log("getSurveyRequestForm -> getAllTopicRequestQuestion", err)
      );

    console.log(
      "getSurveyRequestForm -> axios.all(surveyRequestForm)",
      surveyRequestForm
    );
  };

  const getResponseList = id => {
    getAllRequestResponses()
      .then(res => {
        //RequestResponses takes
        let RequestResponses = res.filter(
          response => response.surveyrequestid === id
        );
        setRequestID(id);
        // console.log("getAllRequestResponses -> requestID", requestID);
        // console.log("getResponseList -> res", res);
        // console.log("getResponseList -> RequestResponses", RequestResponses);
        let temp = [];
        axios
          .all(
            RequestResponses.map(item => {
              getRequestQuestionByID(item.requestquestionid)
                .then(res => {
                  // console.log("getRequestQuestionByID -> item (before reasigning values)", item)
                  item.requestquestionid = res;

                  getProfile(item.respondedby)
                    .then(res => {
                      item.respondedby = res;
                      temp.push(item);
                      console.log(
                        "axios.all(RequestResponse) -> getRequestQuestion -> getProfile -> temp: ",
                        temp
                      );
                      // console.log("getProfile -> item (after reasigning values)", item);
                    })
                    .catch(err =>
                      console.log(
                        "axios.all() -> getProfile -> responseList",
                        err.response
                      )
                    );
                })
                .catch(err =>
                  console.log(
                    "axios.all() -> getRequestQuestionByID -> responseList",
                    err.response
                  )
                );
            })
          )
          .then(res => {
            console.log("axios.all(RequestResponses) -> res", res);
            setResponses(temp);
          })
          .catch(err => console.log("axios.all(RequestResponses)", err));

        console.log("getResponseList -> RequestReponses", responseList);
      })
      .catch(err => console.log("getResponseList", err));
  };

  const getThreadList = id => {
    getAllThreads()
      .then(res => {
        setResponseID(id);
        let ResponseThread = res.filter(thrd => thrd.responseid === id);
        setThreads(ResponseThread);

        // console.log("getThreadList -> ResponseID", responseID);
        // console.log("getThreadList", res);
        // console.log("getThreadList -> threads", threads);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home">
      <TopicListContext.Provider value={{ topics }}>
        <TopicQuestionsContext.Provider value={{ topicQuestions }}>
          <QuestionsContext.Provider value={{ questions }}>
            <RequestsContext.Provider value={{ requestsList }}>
              <ResponsesContext.Provider value={{ responseList }}>
                <ThreadsContext.Provider value={{ threads }}>
                  <SurveyRequestsContext.Provider value={{ surveyRequestForm }}>
                    <SurveyContextContext.Provider
                      value={{ surveyContextForm }}
                    >
                      <div className="nav">
                        <h2 className="logo">Apollo</h2>

                        <Button type="primary" href="/">
                          Owner
                        </Button>
                        <Button type="secondary" href="/member">
                          Member
                        </Button>

                        <NewTopicContainer
                          reset={resetTopicID}
                          userInfo={userInfo}
                        />
                        <JoinTopic user={userInfo} topicID={topicID} />

                        <Button
                          type="secondary"
                          onClick={() => authService.logout()}
                        >
                          Log Out
                        </Button>
                      </div>

                      <div className="topics-container">
                        <div className="topics-list">
                          <h2 className="topics-list-title">Your Topics</h2>
                          <TopicsList
                            topicID={getTopicID}
                            getSurveyList={getSurveyRequests}
                            resetReqAndResID={resetReqAndResID}
                            getSurveyRequestForm={getSurveyRequestForm}
                            getSurveyContextForm={getSurveyContextForm}
                          />
                        </div>
                        <div className="main-topic-container">
                          {topicID === 0 ? (
                            <h2>Select a topic from the topics list.</h2>
                          ) : (
                            <MainTopic
                              topicID={topicID}
                              user={userInfo}
                              reset={resetTopicID}
                              getResponseList={getResponseList}
                              requestID={requestID}
                            />
                          )}
                        </div>
                        <div className="response-list">
                          {requestID != 0 ? (
                            <Responses getThreadList={getThreadList} />
                          ) : null}
                        </div>
                        {responseID != 0 ? (
                          <ThreadsList />
                        ) : (
                          <SurveyRequest page={page} />
                        )}
                      </div>
                    </SurveyContextContext.Provider>
                  </SurveyRequestsContext.Provider>
                </ThreadsContext.Provider>
              </ResponsesContext.Provider>
            </RequestsContext.Provider>
          </QuestionsContext.Provider>
        </TopicQuestionsContext.Provider>
      </TopicListContext.Provider>
    </div>
  );
}
export default RenderHomePage;
