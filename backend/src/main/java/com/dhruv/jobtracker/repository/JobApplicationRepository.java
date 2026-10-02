package com.dhruv.jobtracker.repository;

import com.dhruv.jobtracker.model.JobApplication;
import com.dhruv.jobtracker.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findAllByOrderByAppliedDateDesc();
    long countByStatus(ApplicationStatus status);
}
