package com.dhruv.jobtracker.controller;

import com.dhruv.jobtracker.model.JobApplication;
import com.dhruv.jobtracker.model.Interview;
import com.dhruv.jobtracker.model.FollowUp;
import com.dhruv.jobtracker.repository.JobApplicationRepository;
import com.dhruv.jobtracker.repository.InterviewRepository;
import com.dhruv.jobtracker.repository.FollowUpRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final JobApplicationRepository applications;
    private final InterviewRepository interviews;
    private final FollowUpRepository followUps;

    public ApplicationController(JobApplicationRepository applications,
                                 InterviewRepository interviews,
                                 FollowUpRepository followUps) {
        this.applications = applications;
        this.interviews = interviews;
        this.followUps = followUps;
    }

    @GetMapping
    public List<JobApplication> all() {
        return applications.findAllByOrderByAppliedDateDesc();
    }

    @GetMapping("/{id}")
    public JobApplication get(@PathVariable Long id) {
        return applications.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication create(@RequestBody JobApplication app) {
        return applications.save(app);
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @RequestBody JobApplication incoming) {
        JobApplication app = get(id);
        app.setCompany(incoming.getCompany());
        app.setJobTitle(incoming.getJobTitle());
        app.setJobUrl(incoming.getJobUrl());
        app.setLocation(incoming.getLocation());
        app.setJobType(incoming.getJobType());
        app.setSalary(incoming.getSalary());
        app.setAppliedDate(incoming.getAppliedDate());
        app.setStatus(incoming.getStatus());
        app.setPriority(incoming.getPriority());
        app.setNotes(incoming.getNotes());
        app.setResumeVersion(incoming.getResumeVersion());
        return applications.save(app);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        applications.deleteById(id);
    }

    @PostMapping("/{id}/interviews")
    @ResponseStatus(HttpStatus.CREATED)
    public Interview addInterview(@PathVariable Long id, @RequestBody Interview interview) {
        JobApplication app = get(id);
        interview.setApplication(app);
        return interviews.save(interview);
    }

    @PostMapping("/{id}/followups")
    @ResponseStatus(HttpStatus.CREATED)
    public FollowUp addFollowUp(@PathVariable Long id, @RequestBody FollowUp followUp) {
        JobApplication app = get(id);
        followUp.setApplication(app);
        return followUps.save(followUp);
    }
}
