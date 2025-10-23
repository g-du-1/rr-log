package com.gd.exercisetracker.exercisesession;

import com.gd.exercisetracker.TestHelpers;
import com.gd.exercisetracker.security.user.User;
import com.gd.exercisetracker.security.user.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.core.Is.is;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ExerciseSessionControllerTest {
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    TestHelpers testHelpers;

    @Autowired
    UserRepository userRepository;

    @LocalServerPort
    private Integer port;

    @BeforeAll
    static void beforeAll() {
        postgres.start();
    }

    @AfterAll
    static void afterAll() {
        postgres.stop();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
        userRepository.deleteAll();
    }

    @Test
    void savesNewExerciseSession() {
        User user = testHelpers.saveTestUser();
        String jwt = testHelpers.getTestJwt(user.getUserName());

        given()
            .contentType(ContentType.JSON)
            .cookie("JWT_TOKEN", jwt)
            .body("{}")
        .when()
            .post("/api/v1/exercise-session")
        .then()
            .statusCode(200)
            .body("active", is(true))
            .body("createdAt", notNullValue())
            .body("createdAt", not(""));
    }
}
