package com.projet.collab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class CollabApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollabApplication.class, args);
    }

}
