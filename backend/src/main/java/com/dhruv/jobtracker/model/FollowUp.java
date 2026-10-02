package com.dhruv.jobtracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "follow_ups")
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private JobApplication application;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(length = 1000)
    private String note;

    private Boolean completed = false;

    public Long getId() { return id; }
    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
