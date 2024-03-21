import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LeetCodeApp = () => {
  // States
  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const pageSize = 10;
  const navigation = useNavigation();

  // Effects
  useEffect(() => {
    fetchProblems();
  }, []);

  // Functions
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
    console.log('Pressed problem:', problem);
    navigation.navigate('ProblemDetail', { problem: problem.stat.question__title_slug, question__title:problem.stat.question__title, difficulty: problem.difficulty.level, total_acs: problem.total_acs, total_submitted: problem.stat.total_submitted});
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
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Difficulty Level {selectedDifficulty}</Text>
        <FlatList
          data={paginatedProblems}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleProblemPress(item)}>
              <Text>{item.stat.question__title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.stat.question_id.toString()}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Button title="Prev" onPress={handlePrevPage} disabled={currentPage === 1} />
          <Text>Page {currentPage}</Text>
          <Button title="Next" onPress={handleNextPage} disabled={endIdx >= selectedProblems.length} />
        </View>
      </View>
    );
  };

  // Render
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Select difficulty level" onPress={() => setModalVisible(true)} />
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
                title={`Difficulty Level ${difficulty}`}
                onPress={() => {
                  setSelectedDifficulty(difficulty);
                  setCurrentPage(1); // Reset to page 1 when changing difficulty level
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

export default LeetCodeApp;
