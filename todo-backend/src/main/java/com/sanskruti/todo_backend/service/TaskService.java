package com.sanskruti.todo_backend.service;

import com.sanskruti.todo_backend.entity.Task;
import com.sanskruti.todo_backend.repository.TaskRepository;
import com.sanskruti.todo_backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sanskruti.todo_backend.entity.User;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return taskRepository.findByUser(user);
    }

    public Task createTask(Task task, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        task.setUser(user);

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {

        Task task = taskRepository.findById(id).orElse(null);

        if (task != null) {

            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setStatus(updatedTask.getStatus());

            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());

            return taskRepository.save(task);
        }

        return null;
    }
    
}