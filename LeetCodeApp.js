import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

const LeetCodeApp = () => {
  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const pageSize = 100;
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('https://leetcode.com/api/problems/all/');
      const allProblems = response.data.stat_status_pairs.reverse();
      const problemGroups = {};

      allProblems.forEach(problem => {
        const difficulty = problem.difficulty.level;
        if (!problemGroups[difficulty]) {
          problemGroups[difficulty] = [];
        }
        problemGroups[difficulty].push(problem);
      });

      setProblems(problemGroups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching problems: ', error);
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleProblemPress = (problem) => {
    navigation.navigate('ProblemDetail', { question_id: problem.stat.question_id, problem: problem.stat.question__title_slug, question__title: problem.stat.question__title, difficulty: problem.difficulty.level, total_submitted: problem.stat.total_submitted });
  };


  const renderProblemsByDifficulty = () => {
    if (selectedDifficulty === null) {
      return null;
    }

    const selectedProblems = problems[selectedDifficulty];
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedProblems = selectedProblems.slice(startIdx, endIdx);

    return (
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Level {selectedDifficulty}</Text>
        <View style={[styles.questionItem, styles.questionsContainer]}>
        <FlatList
          data={paginatedProblems}
          renderItem={({ index, item }) => {
            const questionIndex = (currentPage - 1) * pageSize + index + 1;
            return (
              <View style={[styles.questionItem, selectedSolution === item && styles.selectedSolution]}>
              <TouchableOpacity onPress={() => { handleProblemPress(item); setSelectedSolution(item);}}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>{questionIndex} {item.stat.question__title}</Text>
              </TouchableOpacity>
              </View>
            )
          }}
          keyExtractor={item => item.stat.question_id.toString()}
        />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Button title="Prev" onPress={handlePrevPage} disabled={currentPage === 1} />
          <Text>Page {currentPage}</Text>
          <Button title="Next" onPress={handleNextPage} disabled={endIdx >= selectedProblems.length} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="choose level" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Button title="Close" onPress={() => setModalVisible(!modalVisible)} />
            {Object.keys(problems).map(difficulty => (
              <Button
                key={difficulty}
                title={`Level ${difficulty}`}
                onPress={() => {
                  setSelectedDifficulty(difficulty);
                  setCurrentPage(1);
                  setModalVisible(false);
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
      {renderProblemsByDifficulty()}
    </View>
  );
};

const styles = StyleSheet.create({
  questionItem: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedSolution: {
    backgroundColor: '#e0e0e0',
  },
  questionsContainer: {
    maxHeight: "76%",
  }
});

export default LeetCodeApp;
