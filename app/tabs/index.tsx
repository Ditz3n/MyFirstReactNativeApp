import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Modal, Platform, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import MusicPlayer from '../../components/MusicPlayer'; // Adjust the path as needed

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<{ id: string; title: string; description: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string; description: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fadeAnims, setFadeAnims] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('tasks');
      const loadedTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
      setTasks(loadedTasks);
      const initialFadeAnims = loadedTasks.reduce((acc: { [key: string]: Animated.Value }, task: { id: string }) => {
        acc[task.id] = new Animated.Value(1);
        return acc;
      }, {});
      setFadeAnims(initialFadeAnims);
    } catch (e) {
      console.error(e);
    }
  };

  const saveTasks = async (newTasks: { id: string; title: string; description: string }[]) => {
    try {
      const jsonValue = JSON.stringify(newTasks);
      await AsyncStorage.setItem('tasks', jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const addTask = () => {
    if (title.trim() && description.trim()) {
      const newTask = { id: Date.now().toString(), title, description };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTitle('');
      setDescription('');
      const newFadeAnim = new Animated.Value(0);
      setFadeAnims(prev => ({ ...prev, [newTask.id]: newFadeAnim }));
      fadeIn(newFadeAnim);
    }
  };

  const openTaskDetail = (task: { id: string; title: string; description: string }) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const deleteTask = (taskId: string) => {
    const deleteConfirmation = () => {
      fadeOut(taskId);
    };

    // Platform-specific delete confirmation logic
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
      if (confirmed) {
        deleteConfirmation();
      }
    } else {
      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete", onPress: deleteConfirmation
        }
      ]);
    }
  };

  const fadeIn = (fadeAnim: Animated.Value) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (taskId: string) => {
    Animated.timing(fadeAnims[taskId], {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      if (Platform.OS !== 'web') {
        closeModal(); // Close the modal after deleting the task on non-web platforms
      }
    });
  };

  return (
    <View style={styles.container}>
      <MusicPlayer />
      <Text style={styles.title}>Listify</Text>
      <Text style={styles.description}>
        Tilføj, administrer og slet dine opgaver nemt.
      </Text>
      <Text style={styles.description}>
        Alle opgaver gemmes lokalt, så du ikke mister dem, selvom du lukker appen.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.titleInput}
          placeholder="Titel"
          placeholderTextColor="#BC6C25"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={24} color="#FEFAE0" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.descriptionInput}
        placeholder="Beskrivelse"
        placeholderTextColor="#BC6C25"
        value={description}
        onChangeText={setDescription}
      />

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View style={{ opacity: fadeAnims[item.id] }}>
            <TouchableOpacity
              style={styles.taskBox}
              onPress={() => openTaskDetail(item)}
              onLongPress={() => deleteTask(item.id)} // Add long-press functionality here
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />

      {selectedTask && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedTask.title}</Text>
              <Text style={styles.modalDescription}>{selectedTask.description}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    Platform.OS === 'ios' && styles.centeredButton
                  ]}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                {Platform.OS === 'web' && (
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(selectedTask.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  title: {
    color: '#BC6C25',
    fontSize: 24,
    marginBottom: 20,
  },
  description: {
    fontSize: 12,
    color: '#BC6C25',
    marginBottom: 20,
    textAlign: 'center',
    marginRight: 40,
    marginLeft: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 15,
  },
  titleInput: {
    flex: 1,
    height: 40,
    borderColor: '#BC6C25',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: '#283618',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#BC6C25',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionInput: {
    height: 40,
    borderColor: '#BC6C25',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: '#283618',
    width: '80%',
  },
  taskList: {
    width: '80%',
    marginTop: 20,
  },
  taskBox: {
    backgroundColor: '#BC6C25',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  taskTitle: {
    color: '#FEFAE0',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#BC6C25',
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FEFAE0',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FEFAE0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    color: '#BC6C25',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#283618',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#BC6C25',
    padding: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  closeButtonText: {
    color: '#FEFAE0',
  },
  centeredButton: {
    marginRight: 0,
  },
});