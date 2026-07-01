package com.sanskruti.todo_backend.controller;

import com.sanskruti.todo_backend.entity.Task;
import com.sanskruti.todo_backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.sanskruti.todo_backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskService taskService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Task> getAllTasks(
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return taskService.getTasksByUser(email);
    }

    @PostMapping
    public Task createTask(
            @RequestBody Task task,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return taskService.createTask(
                task,
                email);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return "Task Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
            @RequestBody Task updatedTask) {

        return taskService.updateTask(id, updatedTask);
    }

    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable String status) {
        return taskService.getTasksByStatus(status);
    }

    @GetMapping("/add-sample")
    public Task addSampleTask() {

        Task task = new Task();

        task.setTitle("Learn React");
        task.setDescription("Complete React Hooks");
        task.setStatus("PENDING");

        return taskService.createTask(task);
    }

    @GetMapping("/test")
    public Task test() {

        Task task = new Task();

        task.setTitle("React");
        task.setDescription("Hooks");
        task.setStatus("PENDING");

        System.out.println("Before Save:");
        System.out.println(task.getTitle());

        Task savedTask = taskService.createTask(task);

        System.out.println("After Save:");
        System.out.println(savedTask.getTitle());

        return savedTask;
    }

    @GetMapping("/delete/{id}")
    public String deleteTaskByBrowser(@PathVariable Long id) {

        taskService.deleteTask(id);

        return "Task Deleted Successfully";
    }

    @GetMapping("/update/{id}")
    public Task updateTaskByBrowser(@PathVariable Long id) {

        Task updatedTask = new Task();

        updatedTask.setTitle("Learn Spring Boot");
        updatedTask.setDescription("Complete CRUD Operations");
        updatedTask.setStatus("COMPLETED");

        return taskService.updateTask(id, updatedTask);
    }

}