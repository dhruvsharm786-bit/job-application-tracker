package com.dhruv.jobtracker.controller;

import com.dhruv.jobtracker.repository.InterviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewRepository repository;

    public InterviewController(InterviewRepository repository) {
        this.repository = repository;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
