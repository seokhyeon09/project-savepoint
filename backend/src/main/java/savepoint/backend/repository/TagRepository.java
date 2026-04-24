// src/main/java/savepoint/backend/repository/TagRepository.java
package savepoint.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
// picstory를 savepoint로 변경!
import savepoint.backend.domain.Tag; 

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag,Long> {
    Optional<Tag> findByMember_IdAndLabel(Long memberId,String label);
    List<Tag> findAllByMember_Id(Long memberId);
    List<Tag> findAllByMember_IdAndLabelIn(Long memberId, Collection<String> labels);
    Optional<Tag> findByIdAndMember_Id(Long id,Long memberId);
}