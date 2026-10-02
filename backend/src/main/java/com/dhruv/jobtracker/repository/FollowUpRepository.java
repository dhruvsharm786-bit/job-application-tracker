package com.dhruv.jobtracker.repository;

import com.dhruv.jobtracker.model.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findAllByCompletedFalseOrderByDueDateAsc();
    long countByCompletedFalseAndDueDateBefore(LocalDate date);
    long countByCompletedFalseAndDueDate(LocalDate date);
}
