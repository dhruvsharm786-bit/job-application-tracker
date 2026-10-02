package com.dhruv.jobtracker.repository;

import com.dhruv.jobtracker.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    long countByScheduledAtGreaterThanEqualAndScheduledAtLessThan(LocalDateTime from, LocalDateTime to);
    List<Interview> findTop10ByScheduledAtGreaterThanEqualOrderByScheduledAtAsc(LocalDateTime from);
}
