package savepoint.backend.web.dto;

import savepoint.backend.domain.Tag;

public record TagResponse(
        Long id,
        String label
) {
    public static TagResponse from(Tag tag){
        return  new TagResponse(
                tag.getId(),
                tag.getLabel()
        );
    }
}
