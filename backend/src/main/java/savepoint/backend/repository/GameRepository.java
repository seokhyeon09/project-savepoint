// src/main/java/savepoint/backend/repository/GameRepository.java
package savepoint.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import savepoint.backend.domain.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
}