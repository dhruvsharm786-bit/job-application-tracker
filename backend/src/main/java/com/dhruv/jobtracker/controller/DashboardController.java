package com.dhruv.jobtracker.controller;

import com.dhruv.jobtracker.model.ApplicationStatus;
import com.dhruv.jobtracker.repository.FollowUpRepository;
import com.dhruv.jobtracker.repository.InterviewRepository;
import com.dhruv.jobtracker.repository.JobApplicationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JobApplicationRepository applications;
    private final InterviewRepository interviews;
    private final FollowUpRepository followUps;

    public DashboardController(JobApplicationRepository applications,
                               InterviewRepository interviews,
                               FollowUpRepository followUps) {
        this.applications = applications;
        this.interviews = interviews;
        this.followUps = followUps;
    }

    @GetMapping
    public Map<String, Object> dashboard() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1).atStartOfDay();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalApplications", applications.count());
        data.put("applied", applications.countByStatus(ApplicationStatus.APPLIED));
        data.put("screening", applications.countByStatus(ApplicationStatus.SCREENING));
        data.put("assessment", applications.countByStatus(ApplicationStatus.ASSESSMENT));
        data.put("interview", applications.countByStatus(ApplicationStatus.INTERVIEW));
        data.put("offers", applications.countByStatus(ApplicationStatus.OFFER));
        data.put("rejected", applications.countByStatus(ApplicationStatus.REJECTED));
        data.put("withdrawn", applications.countByStatus(ApplicationStatus.WITHDRAWN));
        data.put("interviewsToday", interviews.countByScheduledAtGreaterThanEqualAndScheduledAtLessThan(start, tomorrow));
        data.put("overdueFollowUps", followUps.countByCompletedFalseAndDueDateBefore(today));
        data.put("todayFollowUps", followUps.countByCompletedFalseAndDueDate(today));
        return data;
    }
}
