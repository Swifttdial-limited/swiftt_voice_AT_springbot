package com.swifftdial.identityservice.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import com.swifftdial.identityservice.domains.Title;

/**
 * Created by gathigai on 12/17/16.
 */
public interface TitleService {

    Title createTitle(Title newTitle);

    Page<Title> fetchTitles(UUID tenant, Pageable pageable);

    Title updateTitle(UUID tenant, UUID titlePublicId, Title updatedTitle);

    void deleteTitle(UUID tenant, UUID titlePublicId);

    Page<Title> searchTitle(UUID tenant, String name, Pageable pageable);

    List<Title> fetchTitles(UUID tenant);

    Title validate(UUID tenant, UUID titlePublicId);
}
