'use strict'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Keyboard } from 'react-native'; 
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { COMMUNITY_SOLUTIONS_QUERY, COMMUNITY_SOLUTION_QUERY, QUESTION_CONTENT_QUERY } from './queries';
import { GraphQL_LC } from '../LeetCodeApp/src/configs/config.leetcode';
import { MaterialCommunityIcons, Ionicons, AntDesign, Zocial } from '@expo/vector-icons';
import IdeCode from './IdeCode';
import executePythonCode from './apiRequests';
import { encode as base64Encode, decode as base64Decode } from 'base-64';

const ProblemDetailScreen = ({ route }) => {
  const { question_id, problem, question__title, difficulty, total_submitted } = route.params;
  const { width } = useWindowDimensions();
  const [problemData, setProblemData] = useState(null);
  const [showDetail, setShowDetail] = useState(true);
  const [solutionsList, setSolutionsList] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionDetail, setSolutionDetail] = useState(null);
  const [getResponse, setResponse] = useState(null);
  const [showIDE, setShowIDE] = useState(false);
  const [code, setCode] = useState('');
  const cookies = GraphQL_LC.COOKIE;
  const skipSolutions = 0;
  const numberSolutions = 10;
  const lang = 'python3';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = QUESTION_CONTENT_QUERY;

        const variables = {
          "titleSlug": problem
        };

        const response = await fetch(GraphQL_LC.URL.GRAPH_QL_URl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')
          },
          body: JSON.stringify({ query, variables })
        });

        if (response.ok) {
          const data = await response.json();
          const fetchedProblem = data.data.question;
          setProblemData(fetchedProblem);
        } else {
          throw new Error('Failed to fetch problem data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSolutions = async () => {
      try {
        const query = COMMUNITY_SOLUTIONS_QUERY;

        const variables = {
          "questionSlug": problem,
          "skip": skipSolutions,
          "first": numberSolutions,
          "orderBy": "hot",
          "query": "",
          "languageTags": ["python3"],
          "topicTags": []
        };

        const response = await fetch(GraphQL_LC.URL.GRAPH_QL_URl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')
          },
          body: JSON.stringify({ query, variables })
        });

        if (response.ok) {
          const data = await response.json();
          const fetchedSolutions = data.data.questionSolutions.solutions;
          setSolutionsList(fetchedSolutions);
        } else {
          throw new Error('Failed to fetch solutions');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchSolutions();
  }, [problem]);

  const fetchSolutionDetail = async (topicId) => {
    try {
      const query = COMMUNITY_SOLUTION_QUERY;
      const variables = { "topicId": topicId };
      const response = await fetch(GraphQL_LC.URL.GRAPH_QL_URl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')
        },
        body: JSON.stringify({ query, variables })
      });
      if (response.ok) {
        const data = await response.json();
        const fetchedSolutionDetail = data.data.topic;
        setSolutionDetail(fetchedSolutionDetail);
      } else {
        throw new Error('Failed to fetch solution detail');
      }
    } catch (error) {
      console.error(error);
    }


    const submitCode = async () => {
      const csrfToken = "Pdg.u.hFVGTLBJWmxyPauurEX4K9o29bkA5scDKU4SU-1711035060-1.0.1.1-SLSu3G4rDfTmVdE6b4HXfC9Aemk_7yfZi82hGmVXfP6fDyCKxN27apPmr.nvdrA..q0VAX8VITHbvxt02JbJaA";
      const cookies = "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.KpufdHIo8CeGduwC5DCQoba8bmWCjJ9mUTYQ4npFdlk; csrftoken=qXVvyTWOsqgH8HguryXHnRaPQSM1R9KieBUMdTgeKjuV1L81nWMEWoWJnwQt2mRU";
      const url = "https://leetcode.com/problems/two-sum/interpret_solution/";
    
      const requestBody = {
        lang: "python3",
        question_id: "1",
        typed_code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:    return [4]",
        data_input: "[2,7,11,15]\n9\n[3,2,4]\n6\n[3,3]\n6"
      };
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrftoken': csrfToken,
            'Cookie': cookies
          },
          body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
          throw new Error('Failed to submit code');
        }
    
        const responseData = await response.json();
        console.log(responseData); // Xử lý dữ liệu trả về ở đây
      } catch (error) {
        console.error(error);
      }
    };
    
  };

  const renderSolutionItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedSolution(item);
      fetchSolutionDetail(item.id);
      setShowDetail(false);
      setShowSolutions(false);
    }}>
      <View style={[styles.solutionItem, selectedSolution === item && styles.selectedSolution]}>
        <Text style={styles.solutionDetailTitle}>{item.title}</Text>
        <Text>Username: {item.post.author.username}</Text>
        <Text>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const handleRunCode = async () => {
    try {
      const dataInput = ""; // Đặt dữ liệu đầu vào ở đây
      const responsePromise = await executePythonCode(lang, code, dataInput);
      responsePromise.stdout = base64Decode(responsePromise.stdout);
      console.log(responsePromise);
      setResponse(responsePromise);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question__title}</Text>
      <Text style={styles.title}>Difficulty: {"level " + difficulty} | submitted: {total_submitted}</Text>
      {problemData ? (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => {
                setShowDetail(true);
                setShowSolutions(false);
                setShowIDE(false);
                setSolutionDetail(null);
              }}>
                <View>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="black" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDetail(false);
                setShowSolutions(false);
                setShowIDE(true);
                setSolutionDetail(null);
              }}>
                <View>
                  <Ionicons name="terminal" size={24} color="black" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowDetail(false);
                setShowSolutions(true);
                setShowIDE(false);
                setSolutionDetail(null);
              }}>
                <View>
                  <AntDesign name="solution1" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {showDetail && (
            <ScrollView style={styles.scrollView && styles.solutionDetailContainer}>
              <View style={styles.viewContainer}>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: problemData.content
                  }}
                  ignoredDomTags={['font']}
                />
              </View>
            </ScrollView>

          )}

          {showIDE && (
            <>
              <ScrollView style={styles.scrollView && styles.IDEContainer1}>
                <TouchableOpacity style={{ flex: 1 }}>
                  <View style={styles.IDEContainer2}>
                    <IdeCode initialValue={code} onCodeChange={setCode} />
                  </View>
                </TouchableOpacity>

              </ScrollView>
              <TouchableOpacity onPress={() => {
                handleRunCode();
                handlePressOutside();
              }}>
                <View>
                  <Zocial name="googleplay" size={24} color="black" />
                </View>
              </TouchableOpacity>
              {getResponse && (
                <ScrollView style={styles.scrollView && styles.solutionDetailContainer}>
                  <View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `
                        <pre style="font-family: 'Arial', sans-serif;">${getResponse.stdout ? getResponse.stdout.replace(/</g, "&lt;").replace(/\\n/g, '<br>') : ''}</pre>`
                      }}
                      ignoredDomTags={['font', 'int']}
                    />
                  </View>
                </ScrollView>
              )}

            </>

          )}

          {showSolutions && (
            <>
              {solutionsList && (
                <FlatList
                  data={solutionsList}
                  renderItem={renderSolutionItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      {solutionDetail ? (
        <ScrollView style={styles.scrollView && styles.solutionDetailContainer}>
          <View>
            <Text style={styles.solutionDetailTitle}>{solutionDetail.title}</Text>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `
                <pre style="font-family: 'Arial', sans-serif;">${solutionDetail.post?.content
                    .replace(/</g, "&lt;")
                    .replace(/\\n/g, '<br>')
                  }</pre>`
              }}
              ignoredDomTags={['font', 'int']}
            />
          </View>
        </ScrollView>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  viewContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  scrollView: {
    marginTop: 10,
    paddingBottom: 20,
  },
  content: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    height: 30,

  },
  solutionItem: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedSolution: {
    backgroundColor: '#e0e0e0',
  },
  solutionDetailContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 20,
  },
  IDEContainer1: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 20,
    maxHeight: 300
  },
  IDEContainer2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 280
  },
  solutionDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  solutionContent: {
    marginTop: 10,
    fontFamily: 'Courier New',
  },
  codeText: {
    fontSize: 16,
    fontFamily: 'Courier New',
    lineHeight: 24,
  },
  codeContainer: {
    padding: 16,
    height: 200,
    minWidth: "100%",
  },
  text: {
    fontSize: 16,
  },
});

export default ProblemDetailScreen;
