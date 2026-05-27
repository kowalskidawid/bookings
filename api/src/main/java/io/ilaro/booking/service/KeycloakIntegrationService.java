package io.ilaro.booking.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeycloakIntegrationService {

    @Value("${keycloak.admin.server-url:http://localhost:8180}")
    private String serverUrl;

    public void createUserInKeycloak(String email, String firstName, String lastName, String temporaryPassword) {

        try (Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .build()) {

            UserRepresentation keycloakUser = new UserRepresentation();
            keycloakUser.setUsername(email);
            keycloakUser.setEmail(email);
            keycloakUser.setFirstName(firstName);
            keycloakUser.setLastName(lastName);
            keycloakUser.setEnabled(true);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(temporaryPassword);
            credential.setTemporary(true);
            keycloakUser.setCredentials(List.of(credential));

            try (Response response = keycloak.realm("booking").users().create(keycloakUser)) {
                if (response.getStatus() == 409) {
                    throw new RuntimeException("Konto z takim adresem e-mail już istnieje w systemie logowania!");}
                else if (response.getStatus() != 201) {
                    throw new RuntimeException("Nie udało się utworzyć konta w Keycloak. Kod błędu: " + response.getStatus());
                }}
                }
            }

    public void deleteUserFromKeycloak(String email) {
        try (Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .build()) {

            List<UserRepresentation> users = keycloak.realm("booking").users().search(email);

            if (users != null && !users.isEmpty()) {
                String keycloakUserId = users.get(0).getId();

                try (Response response = keycloak.realm("booking").users().delete(keycloakUserId)) {
                    if (response.getStatus() != 204) {
                        throw new RuntimeException("Nie udało się usunąć konta z Keycloak. Kod: " + response.getStatus());
                    }
                }
            }
        }
    }
}