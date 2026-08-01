package com.projet.collab.dto.request;

import javax.validation.constraints.NotBlank;

public class ProjectRequest {

    @NotBlank(message = "Le nom du projet est obligatoire")
    private String name;

    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
