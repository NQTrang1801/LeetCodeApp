'use strict'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, FlatList, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { COMMUNITY_SOLUTIONS_QUERY, COMMUNITY_SOLUTION_QUERY, QUESTION_CONTENT_QUERY } from './queries';
import IdeCode from './IdeCode';
import { GraphQL_LC } from './src/configs/config.api.leetcode'
const ProblemDetailScreen = ({ route }) => {
  const { problem, question__title, difficulty, total_acs, total_submitted } = route.params;
  const [problemData, setProblemData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [solutionsList, setSolutionsList] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionDetail, setSolutionDetail] = useState(null);

  // const cookies = {
  //   'LEETCODE_SESSION': GraphQL_LC.COOKIE.SESSION,
  //   'csrfToken': CSRF_TOKEN
  // };

  console.log(GraphQL_LC)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = QUESTION_CONTENT_QUERY;

        const variables = {
          "titleSlug": problem
        };

        const response = await fetch(GRAPH_QL_URl, {
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
          "skip": 0,
          "first": 5,
          "orderBy": "hot",
          "query": "",
          "languageTags": ["python3"],
          "topicTags": []
        };

        const response = await fetch(GRAPH_QL_URl, {
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
      const response = await fetch(GRAPH_QL_URl, {
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
  };

  const renderSolutionItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedSolution(item);
      fetchSolutionDetail(item.id);
      setShowDetail(false);
      setShowSolutions(false);
    }}>
      <View style={[styles.solutionItem, selectedSolution === item && styles.selectedSolution]}>
        <Text style={styles.solutionTitle}>{item.title}</Text>
        <Text>Username: {item.post.author.username}</Text>
        <Text>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );
  

  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question__title} | Difficulty: {"level " + difficulty} | submitted: {total_submitted}</Text>
      {problemData ? (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.buttonContainer}>
              <Button style={styles.buttonItem} title="Detail" onPress={() => {
                setShowDetail(true);
                setShowSolutions(false);
                setSolutionDetail(null);
              }} />
              <Button style={styles.buttonItem} title="IDE" onPress={() => {
                setShowDetail(false);
                setShowSolutions(false);
                setSolutionDetail(null);
                valueF = {
                  defaultCode: `
                    # Code
                    # Solution 1
                    \`\`\`cpp
                    #include <iostream>
                    int main() {
                      std::cout << "Hello, world!" << std::endl;
                      return 0;
                    }
                    `
                };
              }} />
              <Button style={styles.buttonItem} title="Solutions" onPress={() => {
                setShowDetail(false);
                setShowSolutions(true);
                setSolutionDetail(null);
              }} />
            </View>
          </View>
          {showDetail && (
            // Thay thế các ký tự đặc biệt
            <ScrollView style={styles.scrollView}>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: problemData.content
                }}
                ignoredDomTags={['font']}
              />
            </ScrollView>
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
        <ScrollView style={styles.scrollView}>
          <View style={styles.solutionDetailContainer}>
            <Text style={styles.solutionDetailTitle}>{solutionDetail.title}</Text>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `
                <pre style="font-family: 'Arial', sans-serif;">${solutionDetail.post?.content
                    .replace(/</g, "&lt;")
                    .replace(/\\n/g, '<br>')
                  // Thay thế \\n bằng thẻ <br>
                  }</pre>` // Thay thế ``` bằng thẻ </code>
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
    maxHeight: 400,
    marginTop: 10,
  },
  content: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    height: 20,
  },
  buttonItem: {
    height: 10,
    width: 20,
    fontSize: 5
  },
  solutionItem: {
    padding: 10,
    marginBottom: 10,
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
  solutionDetailTitle: {
    fontSize: 18,
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
