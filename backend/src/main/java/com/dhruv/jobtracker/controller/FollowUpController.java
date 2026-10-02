package com.dhruv.jobtracker.controller;

import com.dhruv.jobtracker.model.FollowUp;
import com.dhruv.jobtracker.repository.FollowUpRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
public class FollowUpController {

    private final FollowUpRepository repository;

    public FollowUpController(FollowUpRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<FollowUp> allOpen() {
        return repository.findAllByCompletedFalseOrderByDueDateAsc();
    }

    @PatchMapping("/{id}/complete")
    public FollowUp complete(@PathVariable Long id) {
        FollowUp f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Follow-up not found"));
        f.setCompleted(true);
        return repository.save(f);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
