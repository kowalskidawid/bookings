CREATE TABLE IF NOT EXISTS users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    user_type     VARCHAR(31)  NOT NULL,
    email         VARCHAR(255),
    password      VARCHAR(255),
    first_name    VARCHAR(255),
    last_name     VARCHAR(255),
    phone_number  VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS services (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    name             VARCHAR(255),
    time_in_minutes  INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS availabilities (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    day_of_week  VARCHAR(20),
    start_at     TIME,
    end_at       TIME,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    readable_id  VARCHAR(255),
    client_id    BIGINT,
    employer_id  BIGINT,
    start_at     DATETIME(6),
    end_at       DATETIME(6),
    status       VARCHAR(31),
    PRIMARY KEY (id),
    CONSTRAINT fk_appointment_client   FOREIGN KEY (client_id)   REFERENCES users (id),
    CONSTRAINT fk_appointment_employer FOREIGN KEY (employer_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS users_services (
    user_id     BIGINT NOT NULL,
    service_id  BIGINT NOT NULL,
    PRIMARY KEY (user_id, service_id),
    CONSTRAINT fk_us_user    FOREIGN KEY (user_id)    REFERENCES users    (id),
    CONSTRAINT fk_us_service FOREIGN KEY (service_id) REFERENCES services (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS users_availabilities (
    user_id          BIGINT NOT NULL,
    availability_id  BIGINT NOT NULL,
    PRIMARY KEY (user_id, availability_id),
    CONSTRAINT fk_ua_user         FOREIGN KEY (user_id)         REFERENCES users         (id),
    CONSTRAINT fk_ua_availability FOREIGN KEY (availability_id) REFERENCES availabilities (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS appointments_services (
    appointment_id  BIGINT NOT NULL,
    service_id      BIGINT NOT NULL,
    PRIMARY KEY (appointment_id, service_id),
    CONSTRAINT fk_as_appointment FOREIGN KEY (appointment_id) REFERENCES appointments (id),
    CONSTRAINT fk_as_service     FOREIGN KEY (service_id)     REFERENCES services     (id)
) ENGINE = InnoDB;
