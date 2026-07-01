package com.sanskruti.todo_backend.repository;

import com.sanskruti.todo_backend.entity.Task;
import com.sanskruti.todo_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(String status);

    List<Task> findByUser(User user);
}