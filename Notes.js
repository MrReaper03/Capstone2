import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';

const Note = ({ note, onDelete, navigation }) => (
  <View style={styles.note}>
    <Text style={styles.noteText}>{note}</Text>
    <TouchableOpacity onPress={onDelete}>
      <FontAwesome name="trash" size={24} color="#DC3545" />
    </TouchableOpacity>
  </View>
);

const Task = ({ task, completed, onPress, onDelete }) => (
  <View style={styles.task}>
    <TouchableOpacity style={styles.checkbox} onPress={onPress}>
      <FontAwesome
        name={completed ? "check-square-o" : "square-o"}
        size={24}
        color={completed ? "#28A745" : "#343A40"}
      />
    </TouchableOpacity>
    <Text style={[styles.taskText, completed && styles.completedTask]}>
      {task}
    </Text>
    <TouchableOpacity onPress={onDelete}>
      <FontAwesome name="trash" size={24} color="#DC3545" />
    </TouchableOpacity>
  </View>
);

const Notes = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('@notes');
        const storedTasks = await AsyncStorage.getItem('@tasks');
        if (storedNotes !== null) {
          setNotes(JSON.parse(storedNotes));
        }
        if (storedTasks !== null) {
          setToDoList(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading data: ', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@notes', JSON.stringify(notes));
        await AsyncStorage.setItem('@tasks', JSON.stringify(toDoList));
      } catch (error) {
        console.error('Error saving data: ', error);
      }
    };

    saveData();
  }, [notes, toDoList]);

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setToDoList([...toDoList, { task: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedToDoList = [...toDoList];
    updatedToDoList[index].completed = !updatedToDoList[index].completed;
    setToDoList(updatedToDoList);
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const deleteTask = (index) => {
    const updatedToDoList = [...toDoList];
    updatedToDoList.splice(index, 1);
    setToDoList(updatedToDoList);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.notesContainer}>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.noteList}>
          {notes.map((note, index) => (
            <Note key={index} note={note} onDelete={() => deleteNote(index)} />
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add a new note..."
          value={newNote}
          onChangeText={(text) => setNewNote(text)}
          placeholderTextColor="#D1D1D1"
        />
        <Button title="Add Note" onPress={handleAddNote} color="#28A745" />
      </View>
      <View style={styles.toDoContainer}>
        <Text style={styles.title}>To-Do List</Text>
        <ScrollView style={styles.taskList}>
          {toDoList.map((item, index) => (
            <Task
              key={index}
              task={item.task}
              completed={item.completed}
              onPress={() => toggleTaskCompletion(index)}
              onDelete={() => deleteTask(index)}
            />
          ))}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          placeholderTextColor="#D1D1D1"
        />
        <Button title="Add Task" onPress={handleAddTask} color="#28A745" />
      </View>
      <Sidebar navigation={navigation} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#c4f3e6", // Light green background for a fresh look
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e4d3d", // Dark green for a strong title contrast
    textAlign: "center",
  },
  notesContainer: {
    flex: 1,
  },
  toDoContainer: {
    flex: 1,
    marginTop: 20,
  },
  noteList: {
    marginBottom: 10,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#8de2d1", // Softer green for note backgrounds
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#8de2d1", // Same soft green for task backgrounds
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    color: "#1e4d3d", // Dark green text for good contrast
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#1e4d3d", // Dark green text for better readability
  },
  checkbox: {
    marginRight: 10,
  },
  input: {
    height: 50,
    borderColor: "#3a7859", // Medium green for a distinct input border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff", // White background for easy writing
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#51c8a8", // Muted green for completed tasks
  },
});

export default Notes;
