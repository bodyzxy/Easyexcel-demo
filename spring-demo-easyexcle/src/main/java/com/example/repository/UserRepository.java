package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 11:23
 */
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
}
