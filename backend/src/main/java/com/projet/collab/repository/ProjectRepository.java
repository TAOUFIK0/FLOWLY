package com.projet.collab.repository;

import com.projet.collab.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByMemberIdsContaining(String userId);

    List<Project> findByOwnerId(String ownerId);
}