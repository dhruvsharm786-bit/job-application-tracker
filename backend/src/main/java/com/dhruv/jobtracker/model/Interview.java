package com.dhruv.jobtracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private JobApplication application;

    private String roundName;

    @Enumerated(EnumType.STRING)
    private InterviewType type = InterviewType.VIDEO;

    private LocalDateTime scheduledAt;
    private String interviewer;
    private String meetingLink;

    @Column(length = 3000)
    private String feedback;

    private Boolean completed = false;

    public Long getId() { return id; }
    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }
    public String getRoundName() { return roundName; }
    public void setRoundName(String roundName) { this.roundName = roundName; }
    public InterviewType getType() { return type; }
    public void setType(InterviewType type) { this.type = type; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public String getInterviewer() { return interviewer; }
    public void setInterviewer(String interviewer) { this.interviewer = interviewer; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
